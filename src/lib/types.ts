export interface BalanceProps {
  balance: number
  handleLogout: () => void
}

export interface Operation {
  id: string
  amount: number
  description: string
  type: 'income' | 'expense'
  date: string
}

export interface OperationFormProps {
  onAddOperation: (
    amount: number,
    description: string,
    type: 'income' | 'expense'
  ) => void
  initialOperation?: Operation | null
  isAuthenticated: boolean
  scrollY?: number
}

export interface OperationsLogProps {
  operations: Operation[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isAuthenticated: boolean
  setPreviousScrollPosition: (scrollY: number) => void
}

export interface LoginFormProps {
  onLogin: (username: string, password: string) => void
}
