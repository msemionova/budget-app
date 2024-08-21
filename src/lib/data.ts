import { Operation } from './types'

export const adminCredentials = {
  username: 'admin',
  password: 'password123',
}

export const daysOfWeek = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]
export const months = [
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

export const mockOperations: Operation[] = [
  {
    id: '1',
    amount: 500,
    description: 'Freelance Project',
    type: 'income',
    date: '2023-01-15T10:00:00Z', // January 15, 2023
  },
  {
    id: '2',
    amount: 1200,
    description: 'Salary',
    type: 'income',
    date: '2023-01-31T15:30:00Z', // January 31, 2023
  },
  {
    id: '3',
    amount: 200,
    description: 'Groceries',
    type: 'expense',
    date: '2023-02-05T12:45:00Z', // February 5, 2023
  },
  {
    id: '4',
    amount: 150,
    description: 'Gym Membership',
    type: 'expense',
    date: '2023-02-20T18:15:00Z', // February 20, 2023
  },
  {
    id: '5',
    amount: 300,
    description: 'Gift',
    type: 'expense',
    date: '2023-03-03T09:00:00Z', // March 3, 2023
  },
  {
    id: '6',
    amount: 800,
    description: 'Freelance Payment',
    type: 'income',
    date: '2023-03-22T11:30:00Z', // March 22, 2023
  },
  {
    id: '7',
    amount: 1000,
    description: 'Salary',
    type: 'income',
    date: '2022-12-01T08:00:00Z', // December 1, 2022
  },
  {
    id: '8',
    amount: 250,
    description: 'Electricity Bill',
    type: 'expense',
    date: '2022-12-15T14:00:00Z', // December 15, 2022
  },
  {
    id: '9',
    amount: 500,
    description: 'Rent',
    type: 'expense',
    date: '2022-11-05T10:00:00Z', // November 5, 2022
  },
  {
    id: '10',
    amount: 700,
    description: 'Bonus',
    type: 'income',
    date: '2022-11-30T16:00:00Z', // November 30, 2022
  },
  {
    id: '11',
    amount: 50,
    description: 'Coffee',
    type: 'expense',
    date: '2023-04-12T07:45:00Z', // April 12, 2023
  },
  {
    id: '12',
    amount: 150,
    description: 'Internet Bill',
    type: 'expense',
    date: '2023-05-01T12:00:00Z', // May 1, 2023
  },
  {
    id: '13',
    amount: 450,
    description: 'Gift',
    type: 'expense',
    date: '2023-06-19T10:30:00Z', // June 19, 2023
  },
  {
    id: '14',
    amount: 750,
    description: 'Freelance Payment',
    type: 'income',
    date: '2023-07-22T09:15:00Z', // July 22, 2023
  },
  {
    id: '15',
    amount: 100,
    description: 'New Book',
    type: 'expense',
    date: '2023-08-10T13:30:00Z', // August 10, 2023
  },
]
