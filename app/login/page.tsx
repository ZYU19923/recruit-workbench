'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { Mail, Key, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Info } from 'lucide-react'

function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPwd, setShowPwd] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('请填写邮箱和密码')
      return
    }

    if (mode === 'register' && password !== confirmPwd) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    const u = { email }
    localStorage.setItem('recruit-workbench-user', JSON.stringify(u))
    setLoading(false)
    window.location.href = '/'
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">
        <div className="flex mb-6 rounded-lg bg-[rgb(var(--muted))] p-0.5">
          <button
            onClick={() => { setMode('login'); setError(null) }}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors',
              mode === 'login' ? 'bg-[rgb(var(--card))] shadow-sm' : 'text-[rgb(var(--muted-foreground))]'
            )}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('register'); setError(null) }}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors',
              mode === 'register' ? 'bg-[rgb(var(--card))] shadow-sm' : 'text-[rgb(var(--muted-foreground))]'
            )}
          >
            注册
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-700 dark:text-blue-300">
          <Info size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium mb-1">本地模式</p>
            <p>数据存储在浏览器中，输入任意邮箱即可进入。</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium">邮箱</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="输入邮箱即可进入"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">密码</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] py-2 pl-9 pr-9 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm font-medium">确认密码</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  placeholder="再次输入密码"
                />
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" disabled={loading} type="submit">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>{mode === 'login' ? '进入工作台' : '注册并进入'}<ArrowRight size={16} /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--muted))] p-4">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold mb-3">
          R
        </div>
        <h1 className="text-xl font-bold">招聘工作台</h1>
        <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
          个人招聘工作管理平台
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-xs text-[rgb(var(--muted-foreground))] mt-6">
        数据存储在您的浏览器中
      </p>
    </div>
  )
}
