import React from 'react'
import { Button } from './ui'
import { BalanceProps } from '@/lib/types'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'

const Balance: React.FC<BalanceProps> = ({ balance, handleLogout }) => {
  return (
    <div className="flex p-4 pb-6 bg-white shadow-lg shadow-slate-500/10 rounded-lg justify-between items-center fixed w-[98vw]">
      <div className="w-4"></div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Текущий баланс:</h2>
        <p
          className={cn(
            'text-[2rem] font-black leading-7',
            balance > 0 ? 'text-emerald-500' : 'text-impact'
          )}
        >
          {balance.toFixed(2)} MDL
        </p>
      </div>
      <div>
        <Button
          onClick={handleLogout}
          className="p-2 bg-impact text-white rounded"
        >
          <LogOut />
        </Button>
      </div>
    </div>
  )
}

export default Balance
