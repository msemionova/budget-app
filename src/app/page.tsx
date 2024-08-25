'use client'
import { useEffect, useState } from 'react'
import { Balance, OperationForm, OperationsLog, LoginForm } from '../components'
import { v4 as uuidv4 } from 'uuid'
import { Operation } from '@/lib/types'
// import { adminCredentials, mockOperations } from '@/lib/data'
import { adminCredentials } from '@/lib/data'

import { ref, onValue, off } from 'firebase/database'
import { realtimeDB } from '../../firebase'

export default function Home() {
  const [operations, setOperations] = useState<Operation[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null
  )
  const [isLoginOpened, setIsLoginOpened] = useState(false)
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  const handleLogin = (username: string, password: string) => {
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      setIsAuthenticated(true)
      setIsLoginOpened(false)
      localStorage.setItem('isAuthenticated', JSON.stringify(true))
    } else {
      alert('Invalid credentials!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.setItem('isAuthenticated', JSON.stringify(false))
  }

  const handleAddOperation = (
    amount: number,
    description: string,
    type: 'income' | 'expense'
  ) => {
    const formattedAmount = Number(amount)
    if (editingOperation) {
      const updatedOperations = operations.map((op) => {
        if (op.id === editingOperation.id) {
          const adjustedBalance =
            op.type === 'income' ? balance - op.amount : balance + op.amount
          setBalance(
            type === 'income'
              ? adjustedBalance + formattedAmount
              : adjustedBalance - formattedAmount
          )

          return { ...op, amount, description, type }
        }
        return op
      })

      setOperations(updatedOperations)
      // Assuming you update operations in Firebase here
      setEditingOperation(null)
    } else {
      const newOperation: Operation = {
        id: uuidv4(),
        amount: formattedAmount,
        description,
        type,
        date: new Date().toISOString(),
      }

      const updatedOperations = [...operations, newOperation]
      setOperations(updatedOperations)
      setBalance(
        type === 'income'
          ? balance + formattedAmount
          : balance - formattedAmount
      )
      // Assuming you add new operation to Firebase here
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
      // Assuming you delete operation from Firebase here
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isLoginOpened ? (
        <LoginForm onLogin={handleLogin} setIsLoginOpened={setIsLoginOpened} />
      ) : (
        <>
          <Balance
            balance={balance}
            isAuthenticated={isAuthenticated}
            setIsLoginOpened={setIsLoginOpened}
            handleLogout={handleLogout}
          />
          <div className="lg:max-w-[70%] m-auto">
            {isAuthenticated && (
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
              isAuthenticated={isAuthenticated}
              setPreviousScrollPosition={setPreviousScrollPosition}
            />
          </div>
        </>
      )}
    </div>
  )
}
