import React from 'react'
import { Button } from './ui'
import { Pencil, Trash } from 'lucide-react'
import { OperationsLogProps } from '@/lib/types'
import { groupByDate, formatDate, formatDateTimeForDisplay } from '@/lib/utils'

const OperationsLog: React.FC<OperationsLogProps> = ({
  operations,
  onEdit,
  onDelete,
  isAuthenticated,
}) => {
  const groupedOperations = groupByDate(operations)

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Список транзакций:</h3>
      {Object.keys(groupedOperations).map((date) => (
        <div key={date} className="mb-4">
          <div className="bg-gray-300 text-gray-800 text-sm font-bold px-2 py-1 rounded mb-2">
            {formatDate(date)}
          </div>
          <ul className="space-y-2">
            {groupedOperations[date].map((op) => (
              <li
                key={op.id}
                className={`group p-2 border rounded ${op.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <b>
                      {op.type === 'income' ? '+' : '-'}
                      {op.amount} MDL
                    </b>
                    <span>{op.description ? `: ${op.description}` : ''}</span>
                    <br />
                    <small className="text-gray-500">
                      {formatDateTimeForDisplay(op.date)}
                    </small>
                  </div>
                  {isAuthenticated && (
                    <div className="flex gap-2 lg:group-hover:flex lg:hidden">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => onEdit(op.id)}
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
