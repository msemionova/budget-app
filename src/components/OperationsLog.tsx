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
import { Calendar, Pencil, Trash } from 'lucide-react'
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
  onUpdateDate,
  isAuthenticated,
  setPreviousScrollPosition,
}) => {
  const [dateEditorOperationId, setDateEditorOperationId] = useState<
    string | null
  >(null)
  const [dateInput, setDateInput] = useState('')
  const groupedOperations = groupByDate(operations)

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
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    dateEditorOperationId === op.id
                      ? 'max-h-24 opacity-100 mb-2'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="h-10 p-2 border rounded bg-white hover:ring-2 hover:ring-impact transition-all flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-emerald-500 text-white w-auto"
                      onClick={() => {
                        if (!dateInput) {
                          return
                        }
                        onUpdateDate(op.id, dateInput)
                        setDateEditorOperationId(null)
                        setDateInput('')
                      }}
                    >
                      Сохранить
                    </Button>
                  </div>
                </div>
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
                        type="button"
                        variant="link"
                        size="icon"
                        className="text-slate-500"
                        onClick={() => {
                          if (dateEditorOperationId === op.id) {
                            setDateEditorOperationId(null)
                            setDateInput('')
                            return
                          }
                          setDateEditorOperationId(op.id)
                          setDateInput(toDateInputValue(op.date))
                        }}
                        title="Изменить дату"
                        aria-label="Изменить дату"
                      >
                        <Calendar />
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
