'use client'
import { useEffect, useState } from 'react'
import { Balance, OperationForm, OperationsLog, LoginForm } from '../components'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { v4 as uuidv4 } from 'uuid'
import { Operation } from '@/lib/types'
import { format, parseISO, isSameMonth } from 'date-fns'
import { ru } from 'date-fns/locale'

import { ref, onValue, off, update, remove, set, get } from 'firebase/database'
import { realtimeDB, auth } from '../../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

type User = {
  email: string
  id: string
  role: 'viewer' | 'editor'
}

export default function Home() {
  const [operations, setOperations] = useState<Operation[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [userRole, setUserRole] = useState<'viewer' | 'editor'>('viewer')
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null
  )
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM')
  ) // Default to current month
  const [monthsWithData, setMonthsWithData] = useState<string[]>([])

  // Populate monthsWithData based on available operations
  useEffect(() => {
    const uniqueMonths = Array.from(
      new Set(operations.map((op) => format(parseISO(op.date), 'yyyy-MM')))
    ).sort((a, b) => b.localeCompare(a)) // Сортируем в обратном порядке (от новых к старым)

    setMonthsWithData(uniqueMonths)
  }, [operations])

  // Filter operations by the selected month
  const filteredOperations = operations.filter((op) =>
    isSameMonth(parseISO(op.date), new Date(selectedMonth))
  )

  const totalIncome = filteredOperations
    .filter((op) => op.type === 'income')
    .reduce((sum, op) => sum + op.amount, 0)

  const totalOutcome = filteredOperations
    .filter((op) => op.type === 'expense')
    .reduce((sum, op) => sum + op.amount, 0)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true)
        setIsLoading(false)
        const uid = user.uid

        // Fetch user role
        const userRef = ref(realtimeDB, `users/${uid}`)
        const snapshot = await get(userRef)
        if (snapshot.exists()) {
          const userData = snapshot.val()
          setUserRole(userData.role)
          localStorage.setItem('userRole', userData.role)
        }
      } else {
        setIsAuthenticated(false)
        setIsLoading(false)
        setUserRole('viewer')
        localStorage.setItem('userRole', 'viewer')
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const operationsRef = ref(realtimeDB, 'operations')

    const handleData = (snapshot: any) => {
      const data = snapshot.val()
      if (data) {
        // Explicitly cast the data to an object with string keys and Operation values
        const operationsArray = Object.values(data) as Operation[]
        setOperations(operationsArray)
        const initialBalance = operationsArray.reduce(
          (acc: number, op: Operation) => {
            return op.type === 'income' ? acc + op.amount : acc - op.amount
          },
          0
        )
        setBalance(initialBalance)
      }
    }

    const handleError = (error: Error) => {
      console.error('Firebase error:', error) // Debugging line
    }

    // Attach the listener
    const unsubscribe = onValue(operationsRef, handleData, handleError)

    // Cleanup function
    return () => {
      off(operationsRef, 'value', handleData)
      unsubscribe() // Ensure you clean up the listener
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated')
      if (isAuthenticated) {
        setIsAuthenticated(JSON.parse(isAuthenticated))
      }
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      )
      const user = userCredential.user

      if (user) {
        // Fetch additional user data after authentication
        const uid = user.uid
        const userRef = ref(realtimeDB, `users/${uid}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const userData = snapshot.val()
          const role = userData.role || 'viewer' // Default role
          localStorage.setItem('userRole', role)
          localStorage.setItem('userUID', uid)
          console.log('User logged in successfully')
          setIsAuthenticated(true)
        } else {
          throw new Error('User data not found')
        }
      }
    } catch (error) {
      alert('Invalid credentials!')
      console.error('Error logging in:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsAuthenticated(false)
      localStorage.setItem('isAuthenticated', JSON.stringify(false))
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleAddOperation = (
    amount: number,
    description: string,
    type: 'income' | 'expense'
  ) => {
    const formattedAmount = Number(amount)
    if (editingOperation) {
      // Update the operation in Firebase
      update(ref(realtimeDB, `operations/${editingOperation.id}`), {
        amount: formattedAmount,
        description,
        type,
        date: editingOperation.date, // Ensure the date is kept unchanged
      })
        .then(() => {
          const adjustedBalance =
            editingOperation.type === 'income'
              ? balance - editingOperation.amount
              : balance + editingOperation.amount
          setBalance(
            type === 'income'
              ? adjustedBalance + formattedAmount
              : adjustedBalance - formattedAmount
          )

          const updatedOperations = operations.map((op) => {
            if (op.id === editingOperation.id) {
              return { ...op, amount: formattedAmount, description, type }
            }
            return op
          })

          setOperations(updatedOperations)
          localStorage.setItem('operations', JSON.stringify(updatedOperations))
          setEditingOperation(null)
        })
        .catch((error) => {
          console.error('Error updating operation:', error)
        })
    } else {
      const newOperation: Operation = {
        id: uuidv4(),
        amount: formattedAmount,
        description,
        type,
        date: new Date().toISOString(), // Ensure date is set when creating new operations
      }

      // Add the new operation to Firebase
      set(ref(realtimeDB, `operations/${newOperation.id}`), newOperation)
        .then(() => {
          const updatedOperations = [...operations, newOperation]
          setOperations(updatedOperations)
          setBalance(
            type === 'income'
              ? balance + formattedAmount
              : balance - formattedAmount
          )
          localStorage.setItem('operations', JSON.stringify(updatedOperations))
        })
        .catch((error) => {
          console.error('Error adding operation:', error)
        })
    }
  }

  const handleEditOperation = (id: string) => {
    const operationToEdit = operations.find((op) => op.id === id)
    if (operationToEdit) {
      setEditingOperation(operationToEdit)
    }
  }

  const handleDeleteOperation = (id: string) => {
    const operationToDelete = operations.find((op) => op.id === id)
    if (operationToDelete) {
      const updatedOperations = operations.filter((op) => op.id !== id)
      setOperations(updatedOperations)
      setBalance(
        operationToDelete.type === 'income'
          ? balance - operationToDelete.amount
          : balance + operationToDelete.amount
      )
      // Delete operation from Firebase
      remove(ref(realtimeDB, `operations/${id}`))
    }
  }

  const isEditor = userRole === 'editor'

  return (
    <div className="min-h-screen bg-white p-4">
      {isLoading ? (
        // Render a loading spinner or a loading message
        <div className="flex justify-center items-center h-screen">
          <span className="font-bold text-impact">Загрузка...</span>
        </div>
      ) : isAuthenticated ? (
        <>
          <Balance balance={balance} handleLogout={handleLogout} />

          <div className="mt-32">
            <div className="lg:max-w-[70%] mx-auto">
              {isAuthenticated && isEditor && (
                <OperationForm
                  scrollY={previousScrollPosition}
                  onAddOperation={handleAddOperation}
                  initialOperation={editingOperation}
                  isAuthenticated={isAuthenticated}
                />
              )}
              <div className="px-4 pt-6 flex items-center justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold sm:text-lg">
                    Операции за месяц:
                  </h3>
                  <div className="flex">
                    <p className="text-emerald-500 font-bold">+{totalIncome}</p>
                    <b className="w-5 text-center">|</b>
                    <p className="text-impact font-bold">-{totalOutcome}</p>
                  </div>
                </div>

                <Select
                  defaultValue={selectedMonth}
                  onValueChange={(value) => setSelectedMonth(value)}
                >
                  <SelectTrigger className="w-[9rem] capitalize">
                    <SelectValue placeholder="За месяц" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthsWithData.map((month) => (
                      <SelectItem
                        key={month}
                        value={month}
                        className="capitalize"
                      >
                        {format(parseISO(`${month}-01`), 'LLLL yyyy', {
                          locale: ru,
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <OperationsLog
                operations={filteredOperations}
                onEdit={handleEditOperation}
                onDelete={handleDeleteOperation}
                isAuthenticated={isAuthenticated && isEditor}
                setPreviousScrollPosition={setPreviousScrollPosition}
              />
            </div>
          </div>
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}
