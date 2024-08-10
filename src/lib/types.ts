export interface BalanceProps {
  balance: number
  isAuthenticated: boolean
  setIsLoginOpened: (state: boolean) => void
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
}

export interface OperationsLogProps {
  operations: Operation[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isAuthenticated: boolean
}

export interface LoginFormProps {
  onLogin: (username: string, password: string) => void
  setIsLoginOpened: (state: boolean) => void
}
