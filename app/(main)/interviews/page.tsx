'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { Plus, Calendar, MapPin, Video, CheckCircle2, XCircle, Clock, UserX } from 'lucide-react'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns'
import { db } from '@/lib/storage'
import { useInterviews, useCandidates, useJobs } from '@/lib/use-store'
import type { InterviewResult } from '@/types'

export default function InterviewsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6))
  const interviews = useInterviews()
  const candidates = useCandidates()
  const jobs = useJobs()

  const enriched = interviews.map(iv => {
    const candidate = candidates.find(c => c.id === iv.candidate_id)
    const job = jobs.find(j => j.id === iv.job_id)
    return { ...iv, candidateName: candidate?.name ?? '未知', candidateInitial: candidate?.name?.[0] ?? '?', jobTitle: job?.title ?? '-' }
  })

  const handleStatusChange = (id: string, status: string) => {
    db.updateInterview(id, { status: status as any })
  }

  const handleResultChange = (id: string, result: string) => {
    db.updateInterview(id, { result: result as InterviewResult })
  }

  const STATUS_OPTIONS = [
    { value: 'scheduled', label: '已安排', icon: <Clock size={14} className="text-blue-500" />, color: 'bg-blue-100 text-blue-700' },
    { value: 'completed', label: '已完成', icon: <CheckCircle2 size={14} className="text-emerald-500" />, color: 'bg-emerald-100 text-emerald-700' },
    { value: 'cancelled', label: '已取消', icon: <XCircle size={14} className="text-gray-400" />, color: 'bg-gray-100 text-gray-500' },
    { value: 'no_show', label: '未参加', icon: <UserX size={14} className="text-red-500" />, color: 'bg-red-100 text-red-700' },
    { value: 'pending', label: '待安排', icon: <Clock size={14} className="text-amber-500" />, color: 'bg-amber-100 text-amber-700' },
  ]

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex rounded-md border border-[rgb(var(--input))] overflow-hidden">
          <button onClick={() => setView('list')} className={cn('px-3 py-1.5 text-sm', view === 'list' ? 'bg-[rgb(var(--accent))] font-medium' : '')}>列表</button>
          <button onClick={() => setView('calendar')} className={cn('px-3 py-1.5 text-sm', view === 'calendar' ? 'bg-[rgb(var(--accent))] font-medium' : '')}>日历</button>
        </div>
        <Link href="/candidates/new">
          <Button size="sm"><Plus size={14} />新增面试</Button>
        </Link>
      </div>

      {view === 'list' ? (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
          <div className="divide-y divide-[rgb(var(--border))]">
            {enriched.map((iv) => (
              <div key={iv.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[rgb(var(--accent))] transition-colors">
                <Link href={`/candidates/detail?id=${iv.candidate_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-medium shrink-0">
                    {iv.candidateInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{iv.candidateName}</span>
                      <span className="text-xs text-[rgb(var(--muted-foreground))]">{iv.jobTitle}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[rgb(var(--muted-foreground))]">
                      <span className="flex items-center gap-1">
                        {iv.location_or_link?.includes('会议') ? <MapPin size={12} /> : <Video size={12} />}
                        {iv.location_or_link}
                      </span>
                      <span>{iv.round} · {iv.interviewer}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-sm text-right">
                    <div className="font-medium">{iv.scheduled_at?.slice(0, 10)}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">{iv.scheduled_at?.slice(11, 16)}</div>
                  </div>
                  <select
                    value={iv.status}
                    onChange={(e) => handleStatusChange(iv.id, e.target.value)}
                    className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  {iv.status === 'completed' && (
                    <select
                      value={iv.result}
                      onChange={(e) => handleResultChange(iv.id, e.target.value)}
                      className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1 text-xs"
                    >
                      <option value="pending">待定</option>
                      <option value="pass">通过</option>
                      <option value="fail">淘汰</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(2026, currentMonth.getMonth() - 1))} className="text-sm hover:text-primary-500">&lt; 上月</button>
            <h3 className="font-semibold">{format(currentMonth, 'yyyy年 MM月')}</h3>
            <button onClick={() => setCurrentMonth(new Date(2026, currentMonth.getMonth() + 1))} className="text-sm hover:text-primary-500">下月 &gt;</button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="py-1 text-center text-xs font-medium text-[rgb(var(--muted-foreground))]">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayInterviews = enriched.filter((iv) => isSameDay(parseISO(iv.scheduled_at), day))
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[80px] border border-[rgb(var(--border))] p-1 text-xs',
                    !isSameMonth(day, currentMonth) && 'opacity-30',
                    isToday(day) && 'bg-primary-50 dark:bg-primary-950'
                  )}
                >
                  <div className={cn('text-right mb-0.5', isToday(day) && 'font-bold text-primary-600')}>
                    {format(day, 'd')}
                  </div>
                  {dayInterviews.map((iv) => (
                    <div key={iv.id} className="mb-0.5 rounded bg-primary-100 dark:bg-primary-900 px-1 py-0.5 text-[10px] leading-tight cursor-pointer hover:bg-primary-200">
                      <div className="font-medium">{iv.candidateName} - {iv.round}</div>
                      <div className="text-[rgb(var(--muted-foreground))]">{iv.scheduled_at?.slice(11, 16)}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
