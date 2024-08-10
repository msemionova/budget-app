import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Operation } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const groupByDate = (operations: Operation[]) => {
  return operations.reduce((groups: Record<string, Operation[]>, operation) => {
    const date = operation.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(operation)
    return groups
  }, {})
}

export function formatDateTimeForDisplay(dateString: string): string {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  const daysOfWeek = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ]
  const months = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
  ]

  const dayOfWeek = daysOfWeek[date.getDay()]
  const month = months[date.getMonth()]
  const dayOfMonth = date.getDate()

  return `${dayOfWeek}, ${dayOfMonth} ${month}`
}
