'use client'
import React, { useState, useEffect } from 'react'
import type { OperationFormProps } from '@/lib/types'
import { Button, Input } from './ui'
import { Plus, Minus } from 'lucide-react'
import { handleScrollByNumber } from '@/lib/utils'

const OperationForm: React.FC<OperationFormProps> = ({
  scrollY = 0,
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
      setAmount('')
      setDescription('')
      setType('income')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row gap-2 p-4 w-full"
    >
      <div className="flex flex-auto justify-between w-full gap-2">
        <Input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded flex-1 min-w-[11rem] lg:max-w-[11rem]"
          required
        />
        <Input
          type="text"
          placeholder="Детали"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded flex-1 min-w-[11rem]"
        />
      </div>
      <div className="flex justify-between gap-2">
        {initialOperation ? (
          <>
            <Button
              onClick={() => {
                setType('income')
                handleScrollByNumber(scrollY)
              }}
              type="submit"
              className="p-2 bg-green-500 text-white rounded min-w-[11rem]"
            >
              Изменить на: <Plus />
            </Button>
            <Button
              onClick={() => {
                setType('expense')
                handleScrollByNumber(scrollY)
              }}
              type="submit"
              className="p-2 bg-orange-500 text-white rounded min-w-[11rem]"
            >
              Изменить на: <Minus />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setType('income')}
              type="submit"
              className="p-2 bg-green-500 text-white rounded min-w-[11rem]"
            >
              <Plus />
            </Button>
            <Button
              onClick={() => setType('expense')}
              type="submit"
              className="p-2 bg-orange-500 text-white rounded min-w-[11rem]"
            >
              <Minus />
            </Button>
          </>
        )}
      </div>
    </form>
  )
}

export default OperationForm
