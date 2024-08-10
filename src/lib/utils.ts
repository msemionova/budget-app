import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Operation } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const groupByDate = (operations: Operation[]) => {
  return operations.reduce((groups: Record<string, Operation[]>, operation) => {
    const date = new Date(operation.date).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(operation)
    return groups
  }, {})
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
