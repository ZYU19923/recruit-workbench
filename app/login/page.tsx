'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError('请输入邮箱地址')
      return
    }
    setLoading(true)
    const u = { email: email.trim() }
    localStorage.setItem('recruit-workbench-user', JSON.stringify(u))
    setLoading(false)
    router.push('/')
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm">

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-4 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <p className="font-medium mb-1">本地工作台</p>
            <p>输入任意名称即可进入，数据保存在浏览器中。</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium">用户名</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] py-2 px-3 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="输入任意用户名即可进入"
              autoFocus
            />
          </div>

          <Button className="w-full" size="lg" disabled={loading} type="submit">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>进入工作台<ArrowRight size={16} /></>}
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
        可安装到桌面 · 数据存储在浏览器中
      </p>
    </div>
  )
}
