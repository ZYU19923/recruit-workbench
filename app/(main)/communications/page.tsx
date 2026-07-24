'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/shared/SearchInput'
import { useCommunications, useCandidates, useJobs } from '@/lib/use-store'
import { COMMUNICATION_METHOD_LABELS } from '@/types'
import type { CommunicationMethod } from '@/types'
import Link from 'next/link'
import { MessageSquare, Phone } from 'lucide-react'

const METHOD_ICONS: Record<string, React.ReactNode> = {
  phone: <Phone size={14} />,
  wechat: <MessageSquare size={14} />,
  boss: <MessageSquare size={14} />,
  email: <MessageSquare size={14} />,
  offline: <MessageSquare size={14} />,
  other: <MessageSquare size={14} />,
}

const METHOD_ICON_COLORS: Record<string, string> = {
  phone: 'bg-blue-100 text-blue-600',
  wechat: 'bg-emerald-100 text-emerald-600',
  boss: 'bg-orange-100 text-orange-600',
  email: 'bg-violet-100 text-violet-600',
  offline: 'bg-teal-100 text-teal-600',
  other: 'bg-gray-100 text-gray-600',
}

export default function CommunicationsPage() {
  const [search, setSearch] = useState('')
  const comms = useCommunications()
  const candidates = useCandidates()
  const jobs = useJobs()

  const enriched = comms.map(c => {
    const candidate = candidates.find(cd => cd.id === c.candidate_id)
    const job = candidate ? jobs.find(j => j.id === candidate.job_id) : null
    return { ...c, candidate, job }
  })

  const filtered = enriched.filter(r => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      r.candidate?.name?.includes(s) ||
      r.job?.title?.includes(s) ||
      r.content.includes(s)
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="搜索沟通内容、候选人..." className="w-64" />
      </div>

      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="divide-y divide-[rgb(var(--border))]">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/candidates/detail?id=${r.candidate_id}`}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-[rgb(var(--accent))] transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`mt-0.5 rounded-full p-1.5 ${METHOD_ICON_COLORS[r.method] ?? 'bg-gray-100 text-gray-600'}`}>
                  {METHOD_ICONS[r.method] ?? <MessageSquare size={14} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.candidate?.name ?? '未知'}</span>
                    <span className="text-xs text-[rgb(var(--muted-foreground))]">{r.job?.title ?? '-'}</span>
                  </div>
                  <p className="text-sm mt-0.5 truncate">{r.content}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[rgb(var(--muted-foreground))]">
                    <span>{r.contact_time?.split('T')[0]}</span>
                    <span className="rounded bg-[rgb(var(--muted))] px-1 py-0.5">{COMMUNICATION_METHOD_LABELS[r.method as CommunicationMethod]}</span>
                    {r.feedback && <span>反馈: {r.feedback}</span>}
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-xs text-right">
                <div className="text-[rgb(var(--muted-foreground))]">下次跟进</div>
                <div className="font-medium text-primary-600">{r.next_follow_up_at || '-'}</div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-[rgb(var(--muted-foreground))]">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暂无沟通记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
