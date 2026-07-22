'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { Plus, FileText, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useWorkLogs } from '@/lib/use-store'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export default function WorkLogsPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const allLogs = useWorkLogs()
  const selectedDate = new Date(2026, 6, 21)

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)

  const weekLogs = allLogs.filter(l => { const d = new Date(l.date); return d >= weekStart && d <= weekEnd })
  const monthLogs = allLogs.filter(l => { const d = new Date(l.date); return d >= monthStart && d <= monthEnd })

  const weeklySummary = {
    contacts: weekLogs.reduce((s, l) => s + l.contacts_count, 0),
    referrals: weekLogs.reduce((s, l) => s + l.referrals_count, 0),
    interviews: weekLogs.reduce((s, l) => s + l.interviews_count, 0),
    jobs: Array.from(new Set(weekLogs.flatMap(l => l.jobs_progressed ? l.jobs_progressed.split(', ') : []))),
  }

  const monthlySummary = {
    contacts: monthLogs.reduce((s, l) => s + l.contacts_count, 0),
    referrals: monthLogs.reduce((s, l) => s + l.referrals_count, 0),
    interviews: monthLogs.reduce((s, l) => s + l.interviews_count, 0),
    jobs: Array.from(new Set(monthLogs.flatMap(l => l.jobs_progressed ? l.jobs_progressed.split(', ') : []))),
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex rounded-md border border-[rgb(var(--input))] overflow-hidden">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn('px-4 py-1.5 text-sm', view === v ? 'bg-[rgb(var(--accent))] font-medium' : '')}>
              {v === 'day' ? '日报' : v === 'week' ? '周报' : '月报'}
            </button>
          ))}
        </div>
        <Link href="/work-logs/new">
          <Button size="sm"><Plus size={14} />记录工作</Button>
        </Link>
      </div>

      {view === 'week' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="font-semibold mb-4">本周汇总 ({format(weekStart, 'MM/dd')} - {format(weekEnd, 'MM/dd')})</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { v: weeklySummary.contacts, l: '联系人数' },
              { v: weeklySummary.referrals, l: '推荐人数' },
              { v: weeklySummary.interviews, l: '面试数' },
              { v: weeklySummary.jobs.length, l: '推进岗位' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'month' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="font-semibold mb-4">本月汇总 ({format(monthStart, 'yyyy年MM月')})</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { v: monthlySummary.contacts, l: '联系人数' },
              { v: monthlySummary.referrals, l: '推荐人数' },
              { v: monthlySummary.interviews, l: '面试数' },
              { v: monthlySummary.jobs.length, l: '推进岗位' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-bold">{s.v}</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {allLogs.map((log) => (
          <div key={log.id} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
            <button
              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-[rgb(var(--accent))] transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-primary-500" />
                <div>
                  <div className="text-sm font-medium">{log.date}</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5 line-clamp-1">{log.completed_items}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-[rgb(var(--muted-foreground))]">
                <span>{log.contacts_count}人联系</span>
                <span>{log.interviews_count}场面</span>
                <ChevronDown size={16} className={cn('transition-transform', expandedId === log.id && 'rotate-180')} />
              </div>
            </button>

            {expandedId === log.id && (
              <div className="border-t border-[rgb(var(--border))] px-5 py-4 space-y-3 text-sm">
                <div>
                  <h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-1">完成事项</h4>
                  <p>{log.completed_items}</p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div><span className="text-xs text-[rgb(var(--muted-foreground))]">联系人数</span><div className="font-semibold">{log.contacts_count}</div></div>
                  <div><span className="text-xs text-[rgb(var(--muted-foreground))]">推荐人数</span><div className="font-semibold">{log.referrals_count}</div></div>
                  <div><span className="text-xs text-[rgb(var(--muted-foreground))]">面试数</span><div className="font-semibold">{log.interviews_count}</div></div>
                  <div><span className="text-xs text-[rgb(var(--muted-foreground))]">推进岗位</span><div className="font-semibold">{log.jobs_progressed}</div></div>
                </div>
                {log.issues && <div><h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-1">遇到的问题</h4><p>{log.issues}</p></div>}
                {log.tomorrow_plan && <div><h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-1">明日计划</h4><p>{log.tomorrow_plan}</p></div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
