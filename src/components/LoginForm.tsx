import { useState } from 'react'
import { Button, Input } from './ui'
import { LoginFormProps } from '@/lib/types'

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, setIsLoginOpened }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
      </div>
      <Button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded w-full mb-4"
      >
        Войти как редактор
      </Button>
      <Button
        onClick={() => setIsLoginOpened(false)}
        className="p-2 bg-gray-500 text-white rounded w-full"
      >
        Вернуться обратно
      </Button>
    </form>
  )
}

export default LoginForm
