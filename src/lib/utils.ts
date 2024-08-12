import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Operation } from '@/lib/types'
import { daysOfWeek, months } from '@/lib/data'

export const handleScrollById = (id: string) => {
  const targetElement = document.querySelector(id)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' })
  }
}

export const handleScrollByNumber = (scrollY: number) => {
  if (scrollY && window !== undefined) {
    window.scrollTo({ top: scrollY, behavior: 'smooth' })
  }
}

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

export function displayDateTime(dateString: string): string {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function displayDate(dateString: string): string {
  const date = new Date(dateString)

  const dayOfWeek = daysOfWeek[date.getDay()]
  const month = months[date.getMonth()]
  const dayOfMonth = date.getDate()

  return `${dayOfWeek}, ${dayOfMonth} ${month}`
}

export const displayMonthYear = () => {
  let now, year, month
  now = new Date()
  year = now.getFullYear()
  month = now.getMonth()
  return `${months[month]} ${year}`
}

export const calculateTotalByType = (operations: Operation[], type: string) => {
  let sum = 0
  operations
    .filter((operation) => operation.type === type)
    .forEach((operation) => {
      sum += operation.amount
    })
  return sum
}
