export type JobStatus = 'hiring' | 'paused' | 'completed' | 'cancelled'

export type CandidateStage =
  | 'resume'
  | 'phone'
  | 'referral'
  | 'first_interview'
  | 'second_interview'
  | 'hrbp'
  | 'offer'
  | 'onboard'
  | 'eliminated'
  | 'withdrawn'

export type CommunicationMethod = 'phone' | 'wechat' | 'boss' | 'email' | 'offline' | 'other'

export type InterviewStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type InterviewResult = 'pass' | 'fail' | 'pending'

export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoType = 'follow_up' | 'interview' | 'offer' | 'leader_feedback' | 'supplement' | 'other'

export interface Job {
  id: string
  title: string
  department: string
  leader: string
  hc: number
  location: string
  salary_range: string
  jd: string
  requirements_must: string
  requirements_nice: string
  education_requirement: string
  experience_requirement: string
  channels: string[]
  status: JobStatus
  notes: string
  expected_completion_date: string | null
  created_at: string
  updated_at: string
  user_id: string
}

export interface Candidate {
  id: string
  job_id: string
  name: string
  phone: string
  email: string
  age: number | null
  education: string
  school: string
  major: string
  work_years: number | null
  current_company: string
  current_position: string
  expected_salary: string
  expected_city: string
  source_channel: string
  resume_notes: string
  communication_notes: string
  stage: CandidateStage
  last_contacted_at: string | null
  next_follow_up_at: string | null
  is_recommended: boolean
  is_interview_scheduled: boolean
  is_offered: boolean
  is_onboarded: boolean
  is_eliminated: boolean
  elimination_reason: string
  resume_file: string | null
  resume_file_name: string | null
  created_at: string
  updated_at: string
  user_id: string
  job?: Job
}

export interface Communication {
  id: string
  candidate_id: string
  contact_time: string
  method: CommunicationMethod
  content: string
  feedback: string
  our_action: string
  next_follow_up_at: string | null
  notes: string
  created_at: string
  user_id: string
  candidate?: Candidate
}

export interface Interview {
  id: string
  candidate_id: string
  job_id: string
  round: string
  interviewer: string
  scheduled_at: string
  location_or_link: string
  status: InterviewStatus
  result: InterviewResult
  feedback: string
  created_at: string
  updated_at: string
  user_id: string
  candidate?: Candidate
  job?: Job
}

export interface Offer {
  id: string
  candidate_id: string
  job_id: string
  offer_date: string
  salary: string
  bonus: string
  equity: string
  is_accepted: boolean
  is_onboarded: boolean
  expected_onboard_date: string | null
  notes: string
  created_at: string
  updated_at: string
  user_id: string
  candidate?: Candidate
  job?: Job
}

export interface WorkLog {
  id: string
  date: string
  completed_items: string
  contacts_count: number
  referrals_count: number
  interviews_count: number
  jobs_progressed: string
  issues: string
  tomorrow_plan: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Todo {
  id: string
  title: string
  description: string
  priority: TodoPriority
  is_completed: boolean
  due_date: string | null
  related_job_id: string | null
  related_candidate_id: string | null
  todo_type: TodoType
  created_at: string
  user_id: string
  related_job?: Job
  related_candidate?: Candidate
}

export const STAGE_LABELS: Record<CandidateStage, string> = {
  resume: '简历',
  phone: '电话',
  referral: '推荐',
  first_interview: '一面',
  second_interview: '二面',
  hrbp: 'HRBP',
  offer: 'Offer',
  onboard: '入职',
  eliminated: '淘汰',
  withdrawn: '放弃',
}

export const STAGE_COLORS: Record<CandidateStage, string> = {
  resume: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  phone: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
  referral: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  first_interview: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  second_interview: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  hrbp: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  offer: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  onboard: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  eliminated: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  withdrawn: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  hiring: '招聘中',
  paused: '暂停',
  completed: '已完成',
  cancelled: '取消',
}

export const COMMUNICATION_METHOD_LABELS: Record<CommunicationMethod, string> = {
  phone: '电话',
  wechat: '微信',
  boss: 'Boss',
  email: '邮件',
  offline: '线下',
  other: '其他',
}

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  pending: '待安排',
  scheduled: '已安排',
  completed: '已完成',
  cancelled: '已取消',
  no_show: '未参加',
}

export const INTERVIEW_RESULT_LABELS: Record<InterviewResult, string> = {
  pass: '通过',
  fail: '淘汰',
  pending: '待定',
}

export const TODO_TYPE_LABELS: Record<TodoType, string> = {
  follow_up: '跟进候选人',
  interview: '面试安排',
  offer: 'Offer 确认',
  leader_feedback: 'Leader 反馈',
  supplement: '补充材料',
  other: '其他',
}
