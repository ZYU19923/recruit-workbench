'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Users, Calendar, Edit, Plus } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { useJob, useCandidatesByJob } from '@/lib/use-store'
import { STAGE_LABELS } from '@/types'
import type { CandidateStage } from '@/types'

const STAGE_DIST = [
  { stage: 'resume', label: '简历' },
  { stage: 'phone', label: '电话' },
  { stage: 'referral', label: '推荐' },
  { stage: 'first_interview', label: '一面' },
  { stage: 'second_interview', label: '二面' },
  { stage: 'hrbp', label: 'HRBP' },
  { stage: 'offer', label: 'Offer' },
  { stage: 'onboard', label: '入职' },
  { stage: 'eliminated', label: '淘汰' },
  { stage: 'withdrawn', label: '放弃' },
]

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = useJob(params.id)
  const candidates = useCandidatesByJob(params.id)

  if (!job) {
    return (
      <div className="py-16 text-center">
        <p className="text-[rgb(var(--muted-foreground))]">岗位不存在</p>
        <Link href="/jobs" className="text-primary-600 text-sm mt-2 inline-block">返回岗位列表</Link>
      </div>
    )
  }

  const stageCounts = STAGE_DIST.map(s => ({
    ...s,
    count: candidates.filter(c => c.stage === s.stage).length,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="rounded-md p-1 hover:bg-[rgb(var(--accent))]">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold">{job.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[rgb(var(--muted-foreground))]">
              <span>{job.department}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Users size={14} />HC {job.hc}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Calendar size={14} />创建 {job.created_at}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}/edit`}>
            <Button variant="outline" size="sm"><Edit size={14} />编辑</Button>
          </Link>
          <Link href={`/candidates/new?job_id=${job.id}`}>
            <Button size="sm"><Plus size={14} />添加候选人</Button>
          </Link>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[rgb(var(--muted-foreground))] uppercase tracking-wide">
          候选人阶段分布
        </h3>
        <div className="grid grid-cols-7 lg:grid-cols-10 gap-2">
          {stageCounts.map((s) => (
            <div
              key={s.stage}
              className={`rounded-lg border border-[rgb(var(--border))] p-3 text-center ${s.count > 0 ? 'bg-[rgb(var(--card))]' : 'opacity-50'}`}
            >
              <div className="text-xl font-bold">{s.count}</div>
              <div className="text-xs text-[rgb(var(--muted-foreground))] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">岗位信息</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--muted-foreground))]">薪资范围</dt>
              <dd>{job.salary_range || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--muted-foreground))]">学历要求</dt>
              <dd>{job.education_requirement || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--muted-foreground))]">经验要求</dt>
              <dd>{job.experience_requirement || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--muted-foreground))]">对接 Leader</dt>
              <dd>{job.leader || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[rgb(var(--muted-foreground))]">预计完成</dt>
              <dd>{job.expected_completion_date || '-'}</dd>
            </div>
          </dl>
          {job.jd && (
            <div className="mt-4 border-t border-[rgb(var(--border))] pt-4">
              <h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-2">JD</h4>
              <p className="text-sm leading-relaxed">{job.jd}</p>
            </div>
          )}
          {job.requirements_must && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-2">必须条件</h4>
              <p className="text-sm">{job.requirements_must}</p>
            </div>
          )}
          {job.requirements_nice && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-2">优先条件</h4>
              <p className="text-sm">{job.requirements_nice}</p>
            </div>
          )}
          {job.channels.length > 0 && (
            <div className="mt-4 border-t border-[rgb(var(--border))] pt-4">
              <h4 className="text-xs font-semibold text-[rgb(var(--muted-foreground))] uppercase mb-2">招聘渠道</h4>
              <div className="flex flex-wrap gap-1">
                {job.channels.map((ch: string) => (
                  <span key={ch} className="rounded-full bg-[rgb(var(--muted))] px-2 py-0.5 text-xs">{ch}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">候选人列表 ({candidates.length})</h3>
          <div className="divide-y divide-[rgb(var(--border))]">
            {candidates.map((c) => (
              <Link
                key={c.id}
                href={`/candidates/${c.id}`}
                className="flex items-center justify-between py-3 hover:bg-[rgb(var(--accent))] px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">{c.source_channel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {STAGE_LABELS[c.stage as CandidateStage] ?? c.stage}
                  </span>
                  <div className="text-xs text-[rgb(var(--muted-foreground))] text-right">
                    <div>上次: {c.last_contacted_at ?? '-'}</div>
                    <div>下次: {c.next_follow_up_at ?? '-'}</div>
                  </div>
                </div>
              </Link>
            ))}
            {candidates.length === 0 && (
              <div className="py-8 text-center text-[rgb(var(--muted-foreground))]">
                <p className="text-sm">暂无候选人</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
