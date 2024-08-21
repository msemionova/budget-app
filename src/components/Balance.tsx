import React from 'react'
import { Button } from './ui'
import { BalanceProps } from '@/lib/types'
import { LogIn, LogOut } from 'lucide-react'

const Balance: React.FC<BalanceProps> = ({
  balance,
  isAuthenticated,
  setIsLoginOpened,
  handleLogout,
}) => {
  return (
    <div className="flex p-4 bg-gray-200 rounded-lg justify-between items-center">
      <div className="w-4"></div>
      <div className="text-center">
        <h2 className="text-lg font-bold">Текущий баланс:</h2>
        <p className="text-2xl">{balance.toFixed(2)} MDL</p>
      </div>
      <div>
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded"
          >
            <LogOut />
          </Button>
        ) : (
          <Button
            onClick={() => setIsLoginOpened(true)}
            className="p-2 bg-blue-500 text-white rounded"
          >
            <LogIn />
          </Button>
        )}
      </div>
    </div>
  )
}

export default Balance
