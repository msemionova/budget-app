import { useState } from 'react'
import { Button, Input } from './ui'
import { LoginFormProps } from '@/lib/types'
import { LogIn, Undo2 } from 'lucide-react'
import Image from 'next/image'

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className="flex h-[90vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="p-4 w-11/12 max-w-sm">
        <div className="flex items-center justify-center w-full mb-5">
          <Image src="/logo.png" alt="Impact Logo" width={100} height={200} />
        </div>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 p-2 border rounded w-full bg-slate-50 hover:border-[#ff1670] transition-all"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 p-2 border rounded w-full  bg-slate-50 hover:border-[#ff1670] transition-all"
            required
          />
        </div>
        <Button
          type="submit"
          className="h-12 p-2 bg-[#ff1670] text-white rounded w-full mb-4"
        >
          <LogIn />
          <p className="ml-2">Войти</p>
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
