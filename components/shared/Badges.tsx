import { cn } from '@/lib/utils'
import type { CandidateStage, JobStatus } from '@/types'
import { getStageColor, getJobStatusColor } from '@/lib/stage-utils'

export function StageBadge({ stage }: { stage: CandidateStage }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getStageColor(stage))}>
      {stage}
    </span>
  )
}

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getJobStatusColor(status))}>
      {status}
    </span>
  )
}
