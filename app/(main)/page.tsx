'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { DataCard } from '@/components/shared/DataCard'
import {
  Users, UserPlus, CalendarCheck, UserCheck, FileText, TrendingUp, AlertCircle, CheckCircle2,
} from 'lucide-react'
import { db } from '@/lib/storage'
import { useTodos, useCandidates, useJobsOverview, useDashboardStats } from '@/lib/use-store'
import { STAGE_LABELS } from '@/types'
import type { CandidateStage } from '@/types'

export default function DashboardPage() {
  const todos = useTodos()
  const stats = useDashboardStats()
  const jobsOverview = useJobsOverview()
  const candidates = useCandidates()
  const recentCandidates = useMemo(() =>
    candidates
      .filter(c => c.stage !== 'eliminated' && c.stage !== 'withdrawn' && c.stage !== 'onboard')
      .slice(0, 5),
    [candidates])

  const activeTodos = todos.filter(t => !t.is_completed)
  const doneTodos = todos.filter(t => t.is_completed)

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (todo) db.updateTodo(id, { is_completed: !todo.is_completed })
  }

  const reminders = [
    { type: 'overdue', text: '刘洋超过 3 天未跟进', date: '7月13日' },
    { type: 'interview', text: '明天 10:00 张伟二面', date: '明天' },
    { type: 'offer', text: '王磊 Offer 待确认', date: '3天前' },
    { type: 'leader', text: '产品经理 JD 待 Leader 确认', date: '2天前' },
  ]

  const TODAY_STATS = [
    { label: '今日联系', value: stats.contactsToday, icon: <Users size={18} /> },
    { label: '新增简历', value: stats.newResumesToday, icon: <UserPlus size={18} /> },
    { label: '今日面试', value: stats.interviewsToday, icon: <CalendarCheck size={18} /> },
    { label: '今日推荐', value: stats.referralsToday, icon: <UserCheck size={18} /> },
    { label: '当前 Offer', value: stats.activeOffers, icon: <FileText size={18} /> },
    { label: '本月入职', value: stats.onboardedThisMonth, icon: <TrendingUp size={18} /> },
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
          今日概览
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {TODAY_STATS.map((stat) => (
            <DataCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
              当前岗位总览
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {jobsOverview.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-[rgb(var(--ring))] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5">
                        {job.department} · HC {job.hc}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      job.status === 'hiring' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {job.status === 'hiring' ? '招聘中' : '暂停'}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="font-semibold text-base">{job.active}</div>
                      <div className="text-[rgb(var(--muted-foreground))]">推进中</div>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{job.interviews}</div>
                      <div className="text-[rgb(var(--muted-foreground))]">面试</div>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{job.offers}</div>
                      <div className="text-[rgb(var(--muted-foreground))]">Offer</div>
                    </div>
                    <div>
                      <div className="font-semibold text-base">{job.onboarded}</div>
                      <div className="text-[rgb(var(--muted-foreground))]">入职</div>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-[rgb(var(--muted))]">
                    <div
                      className="h-1.5 rounded-full bg-primary-500"
                      style={{ width: `${Math.min(100, (job.onboarded / Math.max(job.hc, 1)) * 100)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
              最近跟进候选人
            </h2>
            <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
              <div className="divide-y divide-[rgb(var(--border))]">
                {recentCandidates.map((c) => (
                  <Link
                    key={c.id}
                    href={`/candidates/${c.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[rgb(var(--accent))] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-[rgb(var(--muted-foreground))]">{c.current_position}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {STAGE_LABELS[c.stage as CandidateStage] ?? c.stage}
                      </span>
                      <div className="text-xs text-[rgb(var(--muted-foreground))] text-right">
                        <div>最近: {c.last_contacted_at ?? '-'}</div>
                        <div>下次: {c.next_follow_up_at ?? '-'}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
              今日待办
            </h2>
            <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
              <div className="space-y-1">
                {activeTodos.length === 0 && (
                  <p className="text-sm text-[rgb(var(--muted-foreground))] py-4 text-center">
                    <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-500" />
                    全部完成
                  </p>
                )}
                {activeTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => toggleTodo(todo.id)}
                    className="flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-[rgb(var(--accent))] transition-colors"
                  >
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${
                      todo.priority === 'high' ? 'border-red-300' : 'border-[rgb(var(--border))]'
                    }`} />
                    <span>{todo.title}</span>
                    {todo.priority === 'high' && (
                      <span className="ml-auto shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-600 dark:bg-red-900 dark:text-red-400">
                        高
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {doneTodos.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] px-2">
                    已完成 ({doneTodos.length})
                  </summary>
                  <div className="mt-1 space-y-0.5">
                    {doneTodos.map((todo) => (
                      <div key={todo.id} className="flex items-center gap-2 rounded px-2 py-1 text-xs text-[rgb(var(--muted-foreground))] line-through">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        {todo.title}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
              提醒事项
            </h2>
            <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3">
              <div className="space-y-2">
                {reminders.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 rounded px-2 py-1.5 text-sm">
                    <AlertCircle size={16} className={`mt-0.5 shrink-0 ${
                      r.type === 'overdue' ? 'text-red-500' :
                      r.type === 'interview' ? 'text-blue-500' :
                      r.type === 'offer' ? 'text-amber-500' : 'text-violet-500'
                    }`} />
                    <div>
                      <div>{r.text}</div>
                      <div className="text-xs text-[rgb(var(--muted-foreground))]">{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
