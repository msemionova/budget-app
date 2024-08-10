'use client'
import React, { useState, useEffect } from 'react'
import type { OperationFormProps } from '@/lib/types'
import { Button, Input } from './ui'

const OperationForm: React.FC<OperationFormProps> = ({
  onAddOperation,
  initialOperation,
}) => {
  const [amount, setAmount] = useState<number | string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<'income' | 'expense'>('income')

  useEffect(() => {
    if (initialOperation) {
      setAmount(initialOperation.amount)
      setDescription(initialOperation.description)
      setType(initialOperation.type)
    }
  }, [initialOperation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount) {
      onAddOperation(Number(amount), description, type)
      setAmount(0)
      setDescription('')
      setType('income')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 w-full">
      <Input
        type="number"
        placeholder="Количество"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="p-2 border rounded"
        required
      />
      <Input
        type="text"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded"
      />
      <div className="flex justify-between w-full gap-5">
        {initialOperation ? (
          <>
            <Button
              onClick={() => setType('income')}
              type="submit"
              className="p-2 bg-green-500 text-white rounded basis-1/2"
            >
              Изменить на: Пополнение
            </Button>
            <Button
              onClick={() => setType('expense')}
              type="submit"
              className="p-2 bg-orange-500 text-white rounded basis-1/2"
            >
              Изменить на: Расход
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setType('income')}
              type="submit"
              className="p-2 bg-green-500 text-white rounded basis-1/2"
            >
              Пополнение
            </Button>
            <Button
              onClick={() => setType('expense')}
              type="submit"
              className="p-2 bg-orange-500 text-white rounded basis-1/2"
            >
              Расход
            </Button>
          </>
        )}
      </div>
    </form>
  )
}

export default OperationForm
