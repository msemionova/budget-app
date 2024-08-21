import React from 'react'
import { Button } from './ui'
import { Pencil, Trash } from 'lucide-react'
import { OperationsLogProps } from '@/lib/types'
import {
  groupByDate,
  displayDate,
  displayDateTime,
  handleScrollById,
} from '@/lib/utils'

const OperationsLog: React.FC<OperationsLogProps> = ({
  operations,
  onEdit,
  onDelete,
  isAuthenticated,
  setPreviousScrollPosition,
}) => {
  const groupedOperations = groupByDate(operations)

  const sortedDateGroups = Object.keys(groupedOperations).sort(
    (a: string, b: string) => {
      let date1 = new Date(a).getTime()
      let date2 = new Date(b).getTime()
      return date2 - date1
    }
  )

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Список транзакций:</h3>
      {sortedDateGroups.map((date) => (
        <div key={date} className="mb-4">
          <div className="bg-gray-300 text-gray-800 text-sm font-bold px-2 py-1 rounded mb-2">
            {displayDate(date)}
          </div>
          <ul className="space-y-2">
            {groupedOperations[date].map((op) => (
              <li
                id={`operation-${op.id}`}
                key={op.id}
                className={`group p-2 border rounded ${op.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <div className="flex justify-between">
                  <div>
                    <b>
                      {op.type === 'income' ? '+' : '-'}
                      {op.amount} MDL
                    </b>
                    {op.description && (
                      <>
                        <br />
                        <span>{op.description}</span>
                      </>
                    )}
                    <br />
                    <small className="text-gray-500">
                      {displayDateTime(op.date)}
                    </small>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2 lg:group-hover:flex lg:hidden">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => {
                          onEdit(op.id)
                          handleScrollById('#body')
                          if (window !== undefined) {
                            const scrollY = window.scrollY
                            setPreviousScrollPosition(scrollY)
                          }
                        }}
                        className="text-slate-500"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => onDelete(op.id)}
                        className="text-slate-500"
                      >
                        <Trash />
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default OperationsLog
