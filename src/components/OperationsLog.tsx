import React, { useState } from 'react'
import { Button } from './ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
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
      {sortedDateGroups.map((date) => (
        <div key={date} className="mb-4">
          <div className="text-slate-400 text-sm font-bold py-1 rounded mb-2">
            {displayDate(date)}
          </div>
          <ul className="space-y-2">
            {groupedOperations[date].map((op) => (
              <li
                id={`operation-${op.id}`}
                key={op.id}
                className={`group p-2 rounded ${op.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'}`}
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
                      <Dialog>
                        <DialogTrigger className="w-10 h-10">
                          <Button
                            variant="link"
                            size="icon"
                            className="text-slate-500"
                          >
                            <Trash />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Вы точно хотите удалить эту операцию?
                            </DialogTitle>
                            <DialogDescription>
                              Это действие необратимо, данные будут удалены
                              безвозвратно.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <div className="flex items-center justify-between w-full gap-5">
                                <Button
                                  type="button"
                                  className="bg-slate-700 text-background"
                                >
                                  Назад
                                </Button>
                                <Button
                                  onClick={() => onDelete(op.id)}
                                  className="bg-impact text-background"
                                >
                                  Удалить
                                </Button>
                              </div>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
