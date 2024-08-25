'use client'
import { useEffect, useState } from 'react'
import { Balance, OperationForm, OperationsLog, LoginForm } from '../components'
import { v4 as uuidv4 } from 'uuid'
import { Operation } from '@/lib/types'

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
      // Fetch email for the username
      const usersRef = ref(realtimeDB, 'users')
      const snapshot = await get(usersRef)
      if (!snapshot.exists()) {
        throw new Error('No user data found')
      }

      const users = snapshot.val() as Record<string, User>
      const userEntry = Object.values(users).find(
        (user: any) => user.email === username
      )

      if (!userEntry) {
        throw new Error('Username not found')
      }

      const email = userEntry.email
      const role = userEntry.role
      const uid = Object.keys(users).find((key) => users[key].email === email)

      // Sign in with the retrieved email
      await signInWithEmailAndPassword(auth, email, password)

      // Store role and UID in local state or context
      localStorage.setItem('userRole', role)
      localStorage.setItem('userUID', uid || '')
      console.log('User logged in successfully')
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
          <span className="font-bold text-[#ff1670]">Загрузка...</span>
        </div>
      ) : isAuthenticated ? (
        <>
          <Balance balance={balance} handleLogout={handleLogout} />
          <div className="lg:max-w-[70%] mx-auto mt-28">
            {isAuthenticated && isEditor && (
              <OperationForm
                scrollY={previousScrollPosition}
                onAddOperation={handleAddOperation}
                initialOperation={editingOperation}
                isAuthenticated={isAuthenticated}
              />
            )}
            <OperationsLog
              operations={operations}
              onEdit={handleEditOperation}
              onDelete={handleDeleteOperation}
              isAuthenticated={isAuthenticated && isEditor}
              setPreviousScrollPosition={setPreviousScrollPosition}
            />
          </div>
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  )
}
