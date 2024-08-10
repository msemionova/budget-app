'use client'
import { useEffect, useState } from 'react'
import { Balance, OperationForm, OperationsLog, LoginForm } from '../components'
import { v4 as uuidv4 } from 'uuid'
import { Operation } from '@/lib/types'
import { adminCredentials } from '@/lib/data'

export default function Home() {
  const [balance, setBalance] = useState<number>(0)
  const [operations, setOperations] = useState<Operation[]>([])
  const [editingOperation, setEditingOperation] = useState<Operation | null>(
    null
  )
  const [isLoginOpened, setIsLoginOpened] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  useEffect(() => {
    const savedOperations = JSON.parse(
      localStorage.getItem('operations') || '[]'
    )
    setOperations(savedOperations)
    const initialBalance = savedOperations.reduce(
      (acc: number, op: Operation) => {
        return op.type === 'income' ? acc + op.amount : acc - op.amount
      },
      0
    )
    setBalance(initialBalance)
  }, [])

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
      localStorage.setItem('operations', JSON.stringify(updatedOperations))
      setEditingOperation(null)
    } else {
      const newOperation: Operation = {
        id: uuidv4(),
        amount: formattedAmount,
        description,
        type,
        date: new Date().toLocaleString(),
      }

      const updatedOperations = [...operations, newOperation]
      setOperations(updatedOperations)
      localStorage.setItem('operations', JSON.stringify(updatedOperations))
      setBalance(
        type === 'income'
          ? balance + formattedAmount
          : balance - formattedAmount
      )
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
      localStorage.setItem('operations', JSON.stringify(updatedOperations))
      setBalance(
        operationToDelete.type === 'income'
          ? balance - operationToDelete.amount
          : balance + operationToDelete.amount
      )
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
            />
          </div>
        </>
      )}
    </div>
  )
}
