'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/shared/Button'
import { cn } from '@/lib/utils'
import { Plus, Briefcase, MapPin, Edit, Trash2, LayoutList, Columns } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/storage'
import { useJobs, useCandidates } from '@/lib/use-store'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { STAGE_LABELS, STAGE_COLORS } from '@/types'
import type { CandidateStage, Candidate } from '@/types'

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'hiring', label: '招聘中' },
  { value: 'paused', label: '暂停' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '取消' },
]

const STATUS_LABELS: Record<string, string> = {
  hiring: '招聘中', paused: '暂停', completed: '已完成', cancelled: '取消',
}

const KANBAN_COLUMNS: { stage: CandidateStage; label: string; color: string }[] = [
  { stage: 'resume', label: '简历', color: 'border-slate-300' },
  { stage: 'phone', label: '电话', color: 'border-sky-400' },
  { stage: 'referral', label: '推荐', color: 'border-violet-400' },
  { stage: 'first_interview', label: '一面', color: 'border-blue-400' },
  { stage: 'second_interview', label: '二面', color: 'border-indigo-400' },
  { stage: 'hrbp', label: 'HRBP', color: 'border-purple-400' },
  { stage: 'offer', label: 'Offer', color: 'border-amber-400' },
  { stage: 'onboard', label: '入职', color: 'border-emerald-400' },
  { stage: 'eliminated', label: '淘汰', color: 'border-red-400' },
  { stage: 'withdrawn', label: '放弃', color: 'border-gray-400' },
]

function KanbanCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Link
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      href={`/candidates/${candidate.id}`}
      className="block rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-2.5 shadow-sm hover:shadow-md transition-shadow touch-none"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
          {candidate.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium truncate">{candidate.name}</div>
          <div className="text-[10px] text-[rgb(var(--muted-foreground))] truncate">{candidate.current_position || candidate.source_channel}</div>
        </div>
      </div>
      {candidate.next_follow_up_at && (
        <div className="mt-1.5 text-[10px] text-[rgb(var(--muted-foreground))]">
          下次: {candidate.next_follow_up_at}
        </div>
      )}
    </Link>
  )
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const allJobs = useJobs()
  const allCandidates = useCandidates()
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const candidate = allCandidates.find(c => c.id === active.id)
    if (!candidate) return

    const targetColumn = KANBAN_COLUMNS.find(col => col.stage === over.id)
    if (targetColumn) {
      db.updateCandidate(String(active.id), {
        stage: targetColumn.stage,
        is_eliminated: targetColumn.stage === 'eliminated',
      })
    }
  }

  const filtered = allJobs.filter(j => {
    if (search && !j.title.includes(search) && !j.department.includes(search)) return false
    if (statusFilter && j.status !== statusFilter) return false
    return true
  })

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    db.deleteJob(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="搜索岗位、部门..." className="w-64" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-md border border-[rgb(var(--input))] overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={cn('px-3 py-2', viewMode === 'list' ? 'bg-[rgb(var(--accent))]' : '')}
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('px-3 py-2', viewMode === 'kanban' ? 'bg-[rgb(var(--accent))]' : '')}
            >
              <Columns size={16} />
            </button>
          </div>
          <Link href="/jobs/new">
            <Button>
              <Plus size={16} />
              新增岗位
            </Button>
          </Link>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
            {KANBAN_COLUMNS.map(col => {
              const colCandidates = allCandidates.filter(c => c.stage === col.stage)
              const jobMap = new Map(allJobs.map(j => [j.id, j.title]))
              return (
                <div key={col.stage} className={cn('flex-1 min-w-[180px] rounded-lg border-t-4 bg-[rgb(var(--card))] p-3', col.color)}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <span className="rounded-full bg-[rgb(var(--muted))] px-2 py-0.5 text-xs font-medium">{colCandidates.length}</span>
                  </div>
                  <SortableContext items={colCandidates.map(c => c.id)} strategy={verticalListSortingStrategy} id={col.stage}>
                    <div className="space-y-2">
                      {colCandidates.map(c => (
                        <KanbanCard key={c.id} candidate={c} />
                      ))}
                      {colCandidates.length === 0 && (
                        <div className="py-6 text-center text-xs text-[rgb(var(--muted-foreground))] border border-dashed border-[rgb(var(--border))] rounded-lg">
                          拖放候选人来此
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </div>
              )
            })}
          </div>
        </DndContext>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => {
            const jc = allCandidates.filter(c => c.job_id === job.id && !c.is_eliminated && c.stage !== 'withdrawn')
            const active = jc.length
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5 hover:border-[rgb(var(--ring))] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary-600 transition-colors">{job.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[rgb(var(--muted-foreground))]">
                      <span className="flex items-center gap-1"><Briefcase size={12} />{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                    </div>
                  </div>
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    job.status === 'hiring' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
                    job.status === 'paused' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                    job.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  )}>
                    {STATUS_LABELS[job.status] ?? job.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold">{job.hc}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">HC</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{active}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">推进中</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold truncate">{job.leader}</div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))]">对接人</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[rgb(var(--muted-foreground))]">
                  <span>创建: {job.created_at}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="rounded p-1 hover:bg-[rgb(var(--accent))]" onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/jobs/${job.id}`) }}>
                      <Edit size={14} />
                    </button>
                    <button className="rounded p-1 hover:bg-red-50 hover:text-red-600" onClick={(e) => handleDelete(e, job.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!viewMode && filtered.length === 0 && (
        <div className="py-16 text-center text-[rgb(var(--muted-foreground))]">
          <Briefcase size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">暂无岗位</p>
        </div>
      )}
    </div>
  )
}
