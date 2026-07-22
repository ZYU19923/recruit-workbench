import type { CandidateStage, JobStatus } from '@/types'
import { STAGE_LABELS, STAGE_COLORS, JOB_STATUS_LABELS } from '@/types'

export function getStageLabel(stage: CandidateStage): string {
  return STAGE_LABELS[stage]
}

export function getStageColor(stage: CandidateStage): string {
  return STAGE_COLORS[stage]
}

export function getJobStatusLabel(status: JobStatus): string {
  return JOB_STATUS_LABELS[status]
}

export function getJobStatusColor(status: JobStatus): string {
  switch (status) {
    case 'hiring': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
    case 'paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
    case 'completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'cancelled': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }
}

export { STAGE_LABELS, STAGE_COLORS, JOB_STATUS_LABELS }
