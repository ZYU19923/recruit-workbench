'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { LogOut, Search } from 'lucide-react'
import { useJobs, useCandidates } from '@/lib/use-store'
import { STAGE_LABELS } from '@/types'
import type { CandidateStage } from '@/types'

const PAGE_TITLES: Record<string, string> = {
  '/': '工作台',
  '/jobs': '招聘需求',
  '/candidates': '候选人管理',
  '/communications': '沟通记录',
  '/interviews': '面试管理',
  '/offers': 'Offer 管理',
  '/work-logs': '工作记录',
  '/analytics': '统计分析',
  '/todos': '待办提醒',
  '/settings': '设置',
}

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const basePath = '/' + (pathname.split('/')[1] || '')
  const title = PAGE_TITLES[basePath] || '招聘工作台'

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const jobs = useJobs()
  const candidates = useCandidates()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length >= 1 ? [
    ...jobs.filter(j => j.title.includes(query) || j.department.includes(query)).slice(0, 3).map(j => ({
      type: 'job' as const, id: j.id, label: j.title, sub: j.department, href: `/jobs/${j.id}`,
    })),
    ...candidates.filter(c => c.name.includes(query) || c.phone.includes(query)).slice(0, 5).map(c => ({
      type: 'candidate' as const, id: c.id, label: c.name, sub: STAGE_LABELS[c.stage as CandidateStage], href: `/candidates/${c.id}`,
    })),
  ] : []

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const navigate = (href: string) => {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[selectedIdx]) navigate(results[selectedIdx].href)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[rgb(var(--border))] bg-[rgb(var(--background))] px-6">
      <h1 className="text-lg font-semibold text-[rgb(var(--foreground))]">{title}</h1>

      <div className="flex items-center gap-4">
        <div ref={containerRef} className="relative">
          <div className="flex items-center rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2.5 py-1.5 focus-within:border-[rgb(var(--ring))] focus-within:ring-1 focus-within:ring-[rgb(var(--ring))] transition-colors">
            <Search size={14} className="text-[rgb(var(--muted-foreground))] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => { if (query.trim()) setOpen(true) }}
              onKeyDown={handleKeyDown}
              placeholder="搜索岗位或候选人..."
              className="ml-2 w-44 bg-transparent text-sm placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none"
            />
          </div>
          {open && results.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-lg overflow-hidden z-50">
              <div className="py-1">
                {results.map((r, i) => (
                  <button
                    key={r.type + r.id}
                    onClick={() => navigate(r.href)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-[rgb(var(--accent))] transition-colors ${i === selectedIdx ? 'bg-[rgb(var(--accent))]' : ''}`}
                  >
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${r.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700'}`}>
                      {r.type === 'job' ? '岗位' : '候选人'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{r.label}</div>
                      <div className="text-xs text-[rgb(var(--muted-foreground))] truncate">{r.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[rgb(var(--border))] px-4 py-1.5 text-[10px] text-[rgb(var(--muted-foreground))]">
                ↑↓ 导航 · Enter 打开 · Esc 关闭
              </div>
            </div>
          )}
        </div>

        {user && (
          <span className="text-xs text-[rgb(var(--muted-foreground))]">
            {user.email}
          </span>
        )}
        <button
          onClick={() => signOut()}
          className="rounded-md p-1.5 text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))] hover:text-red-600"
          title="退出登录"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
