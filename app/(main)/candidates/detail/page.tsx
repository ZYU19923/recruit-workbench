'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Phone, Mail, MapPin, Calendar, MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { db } from '@/lib/storage'
import { useCandidate, useCommunications, useJobs } from '@/lib/use-store'
import { STAGE_LABELS, STAGE_COLORS, COMMUNICATION_METHOD_LABELS } from '@/types'
import type { CandidateStage, CommunicationMethod } from '@/types'

function CandidateDetailContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  const candidate = useCandidate(id)
  const comms = useCommunications(id)
  const jobs = useJobs()
  const [showCommForm, setShowCommForm] = useState(false)
  const [commForm, setCommForm] = useState({
    method: 'phone' as CommunicationMethod, content: '', feedback: '',
    our_action: '', next_follow_up_at: '',
  })

  if (!candidate) {
    return (
      <div className="py-16 text-center">
        <p className="text-[rgb(var(--muted-foreground))]">候选人不存在</p>
        <Link href="/candidates" className="text-primary-600 text-sm mt-2 inline-block">返回候选人列表</Link>
      </div>
    )
  }

  const handleStageChange = (newStage: CandidateStage) => {
    db.updateCandidate(id, { stage: newStage })
  }

  const handleAddCommunication = () => {
    if (!commForm.content) return
    db.createCommunication({
      candidate_id: id,
      contact_time: new Date().toISOString(),
      method: commForm.method,
      content: commForm.content,
      feedback: commForm.feedback,
      our_action: commForm.our_action,
      next_follow_up_at: commForm.next_follow_up_at || null,
      notes: '',
    })
    setCommForm({ method: 'phone', content: '', feedback: '', our_action: '', next_follow_up_at: '' })
    setShowCommForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/candidates" className="rounded-md p-1 hover:bg-[rgb(var(--accent))]">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-lg font-medium">
              {candidate.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              {candidate.job && (
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))]">
                  <Link href={`/jobs/detail?id=${candidate.job.id}`} className="hover:text-primary-600">{candidate.job.title}</Link>
                  <span>·</span>
                  <span>{candidate.job.department}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/candidates/new?job_id=${id}`}>
            <Button variant="outline" size="sm">编辑</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[rgb(var(--muted-foreground))]">当前阶段</span>
              <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-sm font-medium', STAGE_COLORS[candidate.stage as keyof typeof STAGE_COLORS])}>
                {STAGE_LABELS[candidate.stage as CandidateStage]}
              </span>
            </div>
            <select
              className="mt-3 w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm"
              value={candidate.stage}
              onChange={(e) => handleStageChange(e.target.value as CandidateStage)}
            >
              {Object.entries(STAGE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h3 className="mb-3 text-sm font-semibold">联系方式</h3>
            <div className="space-y-2 text-sm">
              {candidate.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-[rgb(var(--muted-foreground))]" /><span>{candidate.phone}</span></div>}
              {candidate.email && <div className="flex items-center gap-2"><Mail size={14} className="text-[rgb(var(--muted-foreground))]" /><span>{candidate.email}</span></div>}
              {candidate.expected_city && <div className="flex items-center gap-2"><MapPin size={14} className="text-[rgb(var(--muted-foreground))]" /><span>{candidate.expected_city}</span></div>}
            </div>
          </div>

          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h3 className="mb-3 text-sm font-semibold">基本信息</h3>
            <dl className="space-y-2 text-sm">
              {candidate.age && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">年龄</dt><dd>{candidate.age}岁</dd></div>}
              {candidate.education && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">学历</dt><dd>{candidate.education}</dd></div>}
              {candidate.school && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">学校</dt><dd>{candidate.school}</dd></div>}
              {candidate.major && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">专业</dt><dd>{candidate.major}</dd></div>}
              {candidate.work_years != null && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">工作年限</dt><dd>{candidate.work_years}年</dd></div>}
              {candidate.current_company && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">当前公司</dt><dd>{candidate.current_company}</dd></div>}
              {candidate.current_position && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">当前岗位</dt><dd>{candidate.current_position}</dd></div>}
              {candidate.expected_salary && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">期望薪资</dt><dd>{candidate.expected_salary}</dd></div>}
              {candidate.source_channel && <div className="flex justify-between"><dt className="text-[rgb(var(--muted-foreground))]">来源渠道</dt><dd>{candidate.source_channel}</dd></div>}
            </dl>
          </div>

          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <h3 className="mb-3 text-sm font-semibold">跟进信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[rgb(var(--muted-foreground))]" />
                <span className="text-[rgb(var(--muted-foreground))]">最近联系:</span>
                <span>{candidate.last_contacted_at ?? '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[rgb(var(--muted-foreground))]" />
                <span className="text-[rgb(var(--muted-foreground))]">下次跟进:</span>
                <span className="font-medium text-primary-600">{candidate.next_follow_up_at ?? '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {(candidate.resume_notes || candidate.communication_notes) && (
            <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
              {candidate.resume_notes && (
                <>
                  <h3 className="mb-3 text-sm font-semibold">简历评价</h3>
                  <p className="text-sm leading-relaxed">{candidate.resume_notes}</p>
                </>
              )}
              {candidate.communication_notes && (
                <div className={candidate.resume_notes ? 'mt-4 border-t border-[rgb(var(--border))] pt-4' : ''}>
                  <h3 className="mb-2 text-sm font-semibold">沟通备注</h3>
                  <p className="text-sm">{candidate.communication_notes}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">沟通时间线</h3>
              <Button size="sm" variant="outline" onClick={() => setShowCommForm(!showCommForm)}>
                <Plus size={14} />添加沟通
              </Button>
            </div>

            {showCommForm && (
              <div className="mb-4 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-4 space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">沟通方式</label>
                    <select value={commForm.method} onChange={(e) => setCommForm(f => ({ ...f, method: e.target.value as CommunicationMethod }))}
                      className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-sm">
                      {Object.entries(COMMUNICATION_METHOD_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">下次跟进时间</label>
                    <input type="date" value={commForm.next_follow_up_at} onChange={(e) => setCommForm(f => ({ ...f, next_follow_up_at: e.target.value }))}
                      className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">沟通内容</label>
                  <textarea value={commForm.content} onChange={(e) => setCommForm(f => ({ ...f, content: e.target.value }))}
                    rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-sm" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium">对方反馈</label><input type="text" value={commForm.feedback} onChange={(e) => setCommForm(f => ({ ...f, feedback: e.target.value }))} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-sm" /></div>
                  <div><label className="mb-1 block text-xs font-medium">我方动作</label><input type="text" value={commForm.our_action} onChange={(e) => setCommForm(f => ({ ...f, our_action: e.target.value }))} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-sm" /></div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowCommForm(false)}>取消</Button>
                  <Button size="sm" onClick={handleAddCommunication}>保存</Button>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[rgb(var(--border))]" />
              <div className="space-y-5">
                {comms.map((c) => (
                  <div key={c.id} className="relative flex gap-4">
                    <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-primary-500 bg-[rgb(var(--card))]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
                        <span>{c.contact_time?.split('T')[0]}</span>
                        <span className="rounded bg-[rgb(var(--muted))] px-1.5 py-0.5">{COMMUNICATION_METHOD_LABELS[c.method as CommunicationMethod] ?? c.method}</span>
                      </div>
                      <p className="mt-1 text-sm">{c.content}</p>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-[rgb(var(--muted-foreground))]">
                        <div><span className="font-medium text-[rgb(var(--foreground))]">对方反馈:</span> {c.feedback}</div>
                        <div><span className="font-medium text-[rgb(var(--foreground))]">我方动作:</span> {c.our_action}</div>
                      </div>
                      {c.next_follow_up_at && (
                        <div className="mt-1 text-xs">
                          <span className="text-[rgb(var(--muted-foreground))]">下次跟进: </span>
                          <span className="font-medium text-primary-600">{c.next_follow_up_at}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {comms.length === 0 && (
                  <div className="py-8 text-center text-[rgb(var(--muted-foreground))]">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">暂无沟通记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CandidateDetailPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[rgb(var(--muted-foreground))]">加载中...</div>}>
      <CandidateDetailContent />
    </Suspense>
  )
}
