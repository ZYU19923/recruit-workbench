'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useAuth } from '@/components/layout/AuthProvider'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  CalendarCheck,
  FileText,
  ClipboardList,
  BarChart3,
  CheckSquare,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/', label: '工作台', icon: LayoutDashboard },
  { href: '/jobs', label: '招聘需求', icon: Briefcase },
  { href: '/candidates', label: '候选人', icon: Users },
  { href: '/communications', label: '沟通记录', icon: MessageSquare },
  { href: '/interviews', label: '面试管理', icon: CalendarCheck },
  { href: '/offers', label: 'Offer 管理', icon: FileText },
  { href: '/work-logs', label: '工作记录', icon: ClipboardList },
  { href: '/analytics', label: '统计分析', icon: BarChart3 },
  { href: '/todos', label: '待办提醒', icon: CheckSquare },
  { href: '/settings', label: '设置', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-[rgb(var(--border))] bg-[rgb(var(--card))] transition-all duration-200 flex flex-col',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-[rgb(var(--border))] px-4 shrink-0">
        {!collapsed && (
          <Link href="/" className="text-base font-bold text-primary-600">
            招聘工作台
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-md p-1 hover:bg-[rgb(var(--accent))]"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                  : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))] hover:text-[rgb(var(--foreground))]'
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[rgb(var(--border))] p-2 space-y-0.5">
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))]"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>}
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[rgb(var(--muted-foreground))] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <LogOut size={20} />
          {!collapsed && <span>退出登录</span>}
        </button>
      </div>
    </aside>
  )
}
