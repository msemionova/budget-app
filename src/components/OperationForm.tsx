'use client'
import React, { useState, useEffect } from 'react'
import type { OperationFormProps } from '@/lib/types'
import { Button, Input } from './ui'
import { Calendar, Plus, Minus } from 'lucide-react'
import { handleScrollByNumber } from '@/lib/utils'

const OperationForm: React.FC<OperationFormProps> = ({
  scrollY = 0,
  onAddOperation,
  initialOperation,
}) => {
  const [amount, setAmount] = useState<number | string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [dateInput, setDateInput] = useState('')

  const toDateInputValue = (dateString: string) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return ''
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (initialOperation) {
      setAmount(initialOperation.amount)
      setDescription(initialOperation.description)
      setType(initialOperation.type)
      setDateInput(toDateInputValue(initialOperation.date))
      setIsDatePickerVisible(false)
    } else {
      setAmount('')
      setDescription('')
      setType('income')
      setDateInput('')
      setIsDatePickerVisible(false)
    }
  }, [initialOperation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount) {
      onAddOperation(
        Number(amount),
        description,
        type,
        isDatePickerVisible && dateInput ? dateInput : undefined
      )
      if (!initialOperation) {
        setAmount('')
        setDescription('')
        setType('income')
        setDateInput('')
        setIsDatePickerVisible(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 w-full">
      <div className="flex flex-col lg:flex-row gap-2 w-full">
        <div className="flex flex-auto justify-between w-full gap-2">
          <Input
            type="number"
            placeholder="Сумма"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 p-2 border rounded flex-1 min-w-[9rem] lg:max-w-[9rem] bg-slate-50 hover:ring-2 hover:ring-impact transition-all"
            required
          />
          <Input
            type="text"
            placeholder="Детали"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12 p-2 border rounded flex-1 min-w-[9rem] bg-slate-50 hover:ring-2 hover:ring-impact transition-all"
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
                className="h-12 p-2 bg-emerald-500 text-white rounded min-w-[9rem]"
              >
                Изменить на: <Plus />
              </Button>
              <Button
                onClick={() => {
                  setType('expense')
                  handleScrollByNumber(scrollY)
                }}
                type="submit"
                className="h-12 p-2 bg-impact text-white rounded min-w-[9rem]"
              >
                Изменить на: <Minus />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setType('income')}
                type="submit"
                className="h-12 p-2 bg-emerald-500 text-white rounded min-w-[9rem] lg:max-w-[9rem]"
              >
                <Plus />
              </Button>
              <Button
                onClick={() => setType('expense')}
                type="submit"
                className="h-12 p-2 bg-impact text-white rounded min-w-[9rem]"
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsDatePickerVisible((prev) => !prev)}
                className="h-12 w-12 min-w-[3rem]"
                title="Изменить дату"
                aria-label="Изменить дату"
              >
                <Calendar />
              </Button>
            </>
          )}
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isDatePickerVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="h-12 p-2 border rounded w-full bg-slate-50 hover:ring-2 hover:ring-impact transition-all"
        />
      </div>
    </form>
  )
}

export default OperationForm
