'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { useCandidates, useJobs } from '@/lib/use-store'
import { STAGE_LABELS, STAGE_COLORS } from '@/types'
import type { CandidateStage } from '@/types'

const STAGE_OPTIONS = [
  { value: '', label: '全部阶段' },
  { value: 'resume', label: '简历' },
  { value: 'phone', label: '电话' },
  { value: 'referral', label: '推荐' },
  { value: 'first_interview', label: '一面' },
  { value: 'second_interview', label: '二面' },
  { value: 'hrbp', label: 'HRBP' },
  { value: 'offer', label: 'Offer' },
  { value: 'onboard', label: '入职' },
  { value: 'eliminated', label: '淘汰' },
  { value: 'withdrawn', label: '放弃' },
]

export default function CandidatesPage() {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const allCandidates = useCandidates()
  const jobs = useJobs()

  const filtered = allCandidates.filter((c) => {
    const job = jobs.find(j => j.id === c.job_id)
    if (search && !c.name.includes(search) && !(job?.title ?? '').includes(search) && !c.phone.includes(search)) return false
    if (stageFilter && c.stage !== stageFilter) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="搜索姓名、岗位、电话..." className="w-64" />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm"
        >
          {STAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="ml-auto">
          <Link href="/candidates/new">
            <Button><Plus size={16} />新增候选人</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[rgb(var(--muted-foreground))]">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无候选人</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {filtered.map((c) => {
              const job = jobs.find(j => j.id === c.job_id)
              return (
                <Link
                  key={c.id}
                  href={`/candidates/${c.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[rgb(var(--accent))] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-[rgb(var(--muted-foreground))]">
                        {job?.title ?? '-'} · {c.source_channel} · {c.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      STAGE_COLORS[c.stage as CandidateStage]
                    )}>
                      {STAGE_LABELS[c.stage as CandidateStage]}
                    </span>
                    <div className="text-xs text-[rgb(var(--muted-foreground))] text-right min-w-[100px]">
                      {c.last_contacted_at && <div>最近联系: {c.last_contacted_at}</div>}
                      {c.next_follow_up_at && <div>下次跟进: {c.next_follow_up_at}</div>}
                      {c.is_eliminated && <div className="text-red-500">已淘汰 - {c.elimination_reason}</div>}
                      {c.stage === 'withdrawn' && !c.next_follow_up_at && <div className="text-gray-400">已放弃</div>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
