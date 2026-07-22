'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { db } from '@/lib/storage'
import { useOffers, useCandidates, useJobs } from '@/lib/use-store'

export default function OffersPage() {
  const [filter, setFilter] = useState<'all' | 'accepted' | 'rejected' | 'pending'>('all')
  const offers = useOffers()
  const candidates = useCandidates()
  const jobs = useJobs()

  const enriched = offers.map(o => {
    const candidate = candidates.find(c => c.id === o.candidate_id)
    const job = jobs.find(j => j.id === o.job_id)
    return { ...o, candidate, job }
  })

  const filtered = enriched.filter((o) => {
    if (filter === 'accepted') return o.is_accepted
    if (filter === 'rejected') return o.is_accepted === false
    if (filter === 'pending') return !o.is_accepted && !o.is_onboarded
    return true
  })

  const stats = {
    total: offers.length,
    accepted: offers.filter((o) => o.is_accepted).length,
    rejected: offers.filter((o) => !o.is_accepted && !o.is_onboarded).length,
    pending: offers.filter((o) => !o.is_accepted && !o.is_onboarded).length,
  }

  const handleAccept = (id: string) => { db.updateOffer(id, { is_accepted: true }) }
  const handleReject = (id: string) => { db.updateOffer(id, { is_accepted: false }) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '总计', value: stats.total, color: '' },
          { label: '已接受', value: stats.accepted, color: 'text-emerald-600' },
          { label: '已拒绝', value: stats.rejected, color: 'text-red-600' },
          { label: '待确认', value: stats.pending, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-3 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-[rgb(var(--muted-foreground))]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {[
          { value: 'all', label: '全部' },
          { value: 'pending', label: '待确认' },
          { value: 'accepted', label: '已接受' },
          { value: 'rejected', label: '已拒绝' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.value
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                    {o.candidate?.name?.[0] ?? '?'}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{o.candidate?.name ?? '-'}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">{o.job?.title ?? '-'}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {o.is_accepted && <CheckCircle2 size={18} className="text-emerald-500" />}
                {!o.is_accepted && !o.is_onboarded && <Clock size={18} className="text-amber-500" />}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-[rgb(var(--muted-foreground))]">Offer 日期</dt>
                <dd>{o.offer_date}</dd>
              </div>
              <div>
                <dt className="text-xs text-[rgb(var(--muted-foreground))]">薪资</dt>
                <dd className="font-medium">{o.salary}</dd>
              </div>
              <div>
                <dt className="text-xs text-[rgb(var(--muted-foreground))]">奖金</dt>
                <dd>{o.bonus || '-'}</dd>
              </div>
              <div>
                <dt className="text-xs text-[rgb(var(--muted-foreground))]">股权</dt>
                <dd>{o.equity || '-'}</dd>
              </div>
            </dl>

            {o.is_accepted && o.expected_onboard_date && (
              <div className="mt-3 rounded-md bg-emerald-50 dark:bg-emerald-950 px-3 py-2 text-xs">
                <span className="text-emerald-700 dark:text-emerald-300">
                  预计入职: {o.expected_onboard_date}
                </span>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAccept(o.id)}
                className={cn(
                  'flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors',
                  o.is_accepted
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'border border-[rgb(var(--border))] hover:bg-emerald-50 hover:text-emerald-600'
                )}
              >
                接受
              </button>
              <button
                onClick={() => handleReject(o.id)}
                className={cn(
                  'flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors',
                  !o.is_accepted && !o.is_onboarded
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'border border-[rgb(var(--border))] hover:bg-red-50 hover:text-red-600'
                )}
              >
                拒绝
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
