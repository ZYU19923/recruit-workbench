import type { Job, Candidate, Communication, Interview, Offer, WorkLog, Todo } from '@/types'

let nextId = 100

function uid(): string {
  return String(nextId++)
}

// --- Pub/sub for cross-page reactivity ---
let _v = 0
const _listeners = new Set<() => void>()

function _notify() {
  _v++
  _listeners.forEach(fn => fn())
}

// --- Jobs ---
let jobs: Job[] = [
  {
    id: '1', title: '高级前端工程师', department: '技术部', leader: '张总', hc: 2,
    location: '北京', salary_range: '30-50K', jd: '负责公司核心产品前端架构设计和开发，带领前端团队完成产品迭代。',
    requirements_must: '5年以上前端经验，精通 React、TypeScript',
    requirements_nice: '有团队管理经验优先，熟悉 Node.js',
    education_requirement: '本科及以上', experience_requirement: '5-10年',
    channels: ['Boss直聘', '猎聘', '内推'], status: 'hiring', notes: '紧急岗位，Leader 要求月底前至少有一个 Offer',
    expected_completion_date: '2026-08-01', created_at: '2026-06-01', updated_at: '2026-06-01', user_id: 'mock-user',
  },
  {
    id: '2', title: '产品经理', department: '产品部', leader: '李总', hc: 1,
    location: '上海', salary_range: '25-40K', jd: '负责产品规划与设计，推动产品迭代和优化。',
    requirements_must: '3年以上产品经理经验，熟悉 B 端产品',
    requirements_nice: '有招聘/SaaS 产品经验优先',
    education_requirement: '本科及以上', experience_requirement: '3-5年',
    channels: ['Boss直聘', '猎聘'], status: 'hiring', notes: '',
    expected_completion_date: '2026-08-15', created_at: '2026-06-10', updated_at: '2026-06-10', user_id: 'mock-user',
  },
  {
    id: '3', title: 'Java 后端工程师', department: '技术部', leader: '张总', hc: 3,
    location: '北京', salary_range: '35-55K', jd: '负责后端服务开发，参与系统架构设计。',
    requirements_must: '3年以上 Java 经验，熟悉 Spring Boot 微服务架构',
    requirements_nice: '有高并发经验优先，熟悉 K8s',
    education_requirement: '本科及以上', experience_requirement: '3-8年',
    channels: ['Boss直聘', '猎聘', '内推', '拉勾'], status: 'hiring', notes: '',
    expected_completion_date: '2026-09-01', created_at: '2026-05-20', updated_at: '2026-05-20', user_id: 'mock-user',
  },
  {
    id: '4', title: 'UI 设计师', department: '设计部', leader: '王总', hc: 1,
    location: '深圳', salary_range: '20-35K', jd: '负责产品 UI 设计，参与设计系统建设。',
    requirements_must: '3年以上 UI 设计经验，熟练使用 Figma',
    requirements_nice: '有 B 端设计经验优先',
    education_requirement: '本科及以上', experience_requirement: '3-5年',
    channels: ['Boss直聘'], status: 'paused', notes: '暂停招聘，待 Q3 预算确认',
    expected_completion_date: null, created_at: '2026-06-15', updated_at: '2026-06-15', user_id: 'mock-user',
  },
  {
    id: '5', title: '测试工程师', department: '质量部', leader: '赵总', hc: 2,
    location: '杭州', salary_range: '20-30K', jd: '负责产品质量保障，搭建自动化测试体系。',
    requirements_must: '2年以上测试经验，熟悉自动化测试框架',
    requirements_nice: '有性能测试经验优先',
    education_requirement: '本科及以上', experience_requirement: '2-5年',
    channels: ['Boss直聘', '猎聘'], status: 'completed', notes: '',
    expected_completion_date: '2026-07-01', created_at: '2026-04-01', updated_at: '2026-07-01', user_id: 'mock-user',
  },
]

// --- Candidates ---
let candidates: Candidate[] = [
  {
    id: '1', job_id: '1', name: '张伟', phone: '138****1234', email: 'zhangwei@email.com',
    age: 30, education: '本科', school: '北京大学', major: '计算机科学', work_years: 7,
    current_company: '字节跳动', current_position: '高级前端工程师', expected_salary: '40-50K',
    expected_city: '北京', source_channel: 'Boss直聘', stage: 'second_interview',
    resume_notes: '候选人技术能力扎实，有大型项目经验，沟通表达清晰。之前在字节负责抖音电商前端架构。',
    communication_notes: '对薪资期望较高，需要沟通具体数字。对技术栈匹配度高，意愿较强。',
    last_contacted_at: '2026-07-15', next_follow_up_at: '2026-07-18',
    is_recommended: false, is_interview_scheduled: true, is_offered: false, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-07-05', updated_at: '2026-07-15', user_id: 'mock-user',
  },
  {
    id: '2', job_id: '2', name: '李娜', phone: '139****5678', email: 'lina@email.com',
    age: 28, education: '硕士', school: '复旦大学', major: '工商管理', work_years: 5,
    current_company: '美团', current_position: '产品经理', expected_salary: '30-40K',
    expected_city: '上海', source_channel: '猎聘', stage: 'first_interview',
    resume_notes: '有丰富的 B 端产品经验，逻辑清晰。',
    communication_notes: '',
    last_contacted_at: '2026-07-15', next_follow_up_at: '2026-07-17',
    is_recommended: false, is_interview_scheduled: true, is_offered: false, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-07-08', updated_at: '2026-07-15', user_id: 'mock-user',
  },
  {
    id: '3', job_id: '3', name: '王磊', phone: '137****9012', email: 'wanglei@email.com',
    age: 32, education: '硕士', school: '上海交大', major: '软件工程', work_years: 8,
    current_company: '阿里', current_position: 'Java 技术专家', expected_salary: '45-55K',
    expected_city: '北京', source_channel: '内推', stage: 'offer',
    resume_notes: '技术能力突出，有分布式系统经验。',
    communication_notes: '薪资预期在预算范围内，推进 Offer 流程。',
    last_contacted_at: '2026-07-14', next_follow_up_at: '2026-07-20',
    is_recommended: true, is_interview_scheduled: false, is_offered: true, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-07-02', updated_at: '2026-07-14', user_id: 'mock-user',
  },
  {
    id: '4', job_id: '1', name: '陈静', phone: '136****3456', email: 'chenjing@email.com',
    age: 27, education: '本科', school: '浙江大学', major: '软件工程', work_years: 4,
    current_company: '腾讯', current_position: '前端工程师', expected_salary: '35-45K',
    expected_city: '北京', source_channel: 'Boss直聘', stage: 'hrbp',
    resume_notes: 'React 熟练，有组件库开发经验。',
    communication_notes: '',
    last_contacted_at: '2026-07-14', next_follow_up_at: '2026-07-16',
    is_recommended: false, is_interview_scheduled: false, is_offered: false, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-07-06', updated_at: '2026-07-14', user_id: 'mock-user',
  },
  {
    id: '5', job_id: '3', name: '刘洋', phone: '135****7890', email: 'liuyang@email.com',
    age: 26, education: '硕士', school: '华中科技', major: '计算机科学', work_years: 2,
    current_company: '京东', current_position: 'Java 工程师', expected_salary: '25-30K',
    expected_city: '北京', source_channel: '猎聘', stage: 'resume',
    resume_notes: '应届刚过，潜力不错。',
    communication_notes: '需要跟进，已超过 3 天未联系。',
    last_contacted_at: '2026-07-13', next_follow_up_at: '2026-07-17',
    is_recommended: false, is_interview_scheduled: false, is_offered: false, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-07-10', updated_at: '2026-07-13', user_id: 'mock-user',
  },
  {
    id: '6', job_id: '4', name: '赵雪', phone: '134****2345', email: 'zhaoxue@email.com',
    age: 29, education: '本科', school: '中国美院', major: '视觉传达', work_years: 6,
    current_company: '网易', current_position: '高级 UI 设计师', expected_salary: '30-35K',
    expected_city: '深圳', source_channel: 'Boss直聘', stage: 'eliminated',
    resume_notes: '设计能力不错，但风格不匹配。',
    communication_notes: '',
    last_contacted_at: '2026-07-10', next_follow_up_at: null,
    is_recommended: false, is_interview_scheduled: false, is_offered: false, is_onboarded: false,
    is_eliminated: true, elimination_reason: '设计风格与团队不匹配',
    resume_file: null, resume_file_name: null,
    created_at: '2026-06-20', updated_at: '2026-07-10', user_id: 'mock-user',
  },
  {
    id: '7', job_id: '5', name: '孙鹏', phone: '133****6789', email: 'sunpeng@email.com',
    age: 31, education: '本科', school: '西安电子科技', major: '计算机科学', work_years: 7,
    current_company: '华为', current_position: '测试工程师', expected_salary: '25-30K',
    expected_city: '杭州', source_channel: '猎聘', stage: 'withdrawn',
    resume_notes: '接受了其他公司 Offer。',
    communication_notes: '',
    last_contacted_at: '2026-07-08', next_follow_up_at: null,
    is_recommended: false, is_interview_scheduled: false, is_offered: false, is_onboarded: false,
    is_eliminated: false, elimination_reason: '',
    resume_file: null, resume_file_name: null,
    created_at: '2026-05-15', updated_at: '2026-07-08', user_id: 'mock-user',
  },
]

// --- Communications ---
let communications: Communication[] = [
  { id: '1', candidate_id: '1', contact_time: '2026-07-15T10:00:00', method: 'phone', content: '电话沟通二面安排，候选人表示周三下午方便', feedback: '积极回应', our_action: '安排二面', next_follow_up_at: '2026-07-18', notes: '', created_at: '2026-07-15T10:00:00', user_id: 'mock-user' },
  { id: '2', candidate_id: '1', contact_time: '2026-07-10T14:00:00', method: 'wechat', content: '微信确认一面通过，进入二面环节', feedback: '满意一面体验', our_action: '通知一面结果', next_follow_up_at: '2026-07-14', notes: '', created_at: '2026-07-10T14:00:00', user_id: 'mock-user' },
  { id: '3', candidate_id: '1', contact_time: '2026-07-05T09:00:00', method: 'boss', content: 'Boss 直聘初步沟通，介绍岗位基本情况', feedback: '对岗位感兴趣', our_action: '发送 JD 和公司介绍', next_follow_up_at: '2026-07-08', notes: '', created_at: '2026-07-05T09:00:00', user_id: 'mock-user' },
]

// --- Interviews ---
let interviews: Interview[] = [
  { id: '1', candidate_id: '1', job_id: '1', round: 'first', interviewer: '张总', scheduled_at: '2026-07-12T14:00:00', location_or_link: '腾讯会议', status: 'completed', result: 'pass', feedback: '技术基础扎实，项目经验匹配', created_at: '2026-07-10', updated_at: '2026-07-12', user_id: 'mock-user' },
  { id: '2', candidate_id: '1', job_id: '1', round: 'second', interviewer: '李总', scheduled_at: '2026-07-17T10:00:00', location_or_link: '公司会议室 A', status: 'scheduled', result: 'pending', feedback: '', created_at: '2026-07-15', updated_at: '2026-07-15', user_id: 'mock-user' },
  { id: '3', candidate_id: '2', job_id: '2', round: 'first', interviewer: '李总', scheduled_at: '2026-07-16T15:00:00', location_or_link: '腾讯会议', status: 'scheduled', result: 'pending', feedback: '', created_at: '2026-07-14', updated_at: '2026-07-14', user_id: 'mock-user' },
  { id: '4', candidate_id: '3', job_id: '3', round: 'first', interviewer: '张总', scheduled_at: '2026-07-08T10:00:00', location_or_link: '公司会议室 B', status: 'completed', result: 'pass', feedback: '架构能力突出', created_at: '2026-07-06', updated_at: '2026-07-08', user_id: 'mock-user' },
  { id: '5', candidate_id: '3', job_id: '3', round: 'second', interviewer: '赵总', scheduled_at: '2026-07-12T14:00:00', location_or_link: '公司会议室 A', status: 'completed', result: 'pass', feedback: '沟通表达优秀，团队匹配', created_at: '2026-07-09', updated_at: '2026-07-12', user_id: 'mock-user' },
  { id: '6', candidate_id: '3', job_id: '3', round: 'hrbp', interviewer: '王 HR', scheduled_at: '2026-07-14T11:00:00', location_or_link: '公司会议室 C', status: 'completed', result: 'pass', feedback: '薪资预期在预算内', created_at: '2026-07-12', updated_at: '2026-07-14', user_id: 'mock-user' },
]

// --- Offers ---
let offers: Offer[] = [
  { id: '1', candidate_id: '3', job_id: '3', offer_date: '2026-07-15', salary: '50K * 16', bonus: '3个月', equity: '期权', is_accepted: false, is_onboarded: false, expected_onboard_date: '2026-08-01', notes: '', created_at: '2026-07-15', updated_at: '2026-07-15', user_id: 'mock-user' },
]

// --- Work Logs ---
let workLogs: WorkLog[] = [
  { id: '1', date: '2026-07-15', completed_items: '电话联系 5 位候选人\n安排 2 场面试\n整理前端岗位 JD', contacts_count: 5, referrals_count: 1, interviews_count: 2, jobs_progressed: '高级前端工程师岗位推进张伟到二面', issues: '产品经理岗位简历质量偏低', tomorrow_plan: '跟进陈静 HRBP 面\n联系新的产品经理候选人', created_at: '2026-07-15', updated_at: '2026-07-15', user_id: 'mock-user' },
]

// --- Todos ---
let todos: Todo[] = [
  { id: '1', title: '联系候选人张伟确认二面时间', description: '', priority: 'high', is_completed: false, due_date: '2026-07-16', related_job_id: '1', related_candidate_id: '1', todo_type: 'follow_up', created_at: '2026-07-15', user_id: 'mock-user' },
  { id: '2', title: '发 Offer 给王磊', description: '薪资 50K*16，需在 7/20 前确认', priority: 'high', is_completed: false, due_date: '2026-07-20', related_job_id: '3', related_candidate_id: '3', todo_type: 'offer', created_at: '2026-07-15', user_id: 'mock-user' },
  { id: '3', title: '更新产品经理岗位 JD', description: '', priority: 'medium', is_completed: false, due_date: '2026-07-18', related_job_id: '2', related_candidate_id: null, todo_type: 'other', created_at: '2026-07-14', user_id: 'mock-user' },
  { id: '4', title: '整理本周面试反馈给 Leader', description: '', priority: 'medium', is_completed: true, due_date: '2026-07-15', related_job_id: null, related_candidate_id: null, todo_type: 'leader_feedback', created_at: '2026-07-14', user_id: 'mock-user' },
  { id: '5', title: '补充候选人陈静的材料', description: '', priority: 'low', is_completed: true, due_date: '2026-07-16', related_job_id: '1', related_candidate_id: '4', todo_type: 'supplement', created_at: '2026-07-13', user_id: 'mock-user' },
]

// --- CRUD helpers ---

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

export const db = {
  // Jobs
  getJobs: () => clone(jobs),
  getJob: (id: string) => clone(jobs.find(j => j.id === id)) ?? null,
  createJob: (data: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const now = new Date().toISOString().split('T')[0]
    const job: Job = { ...data, id: uid(), created_at: now, updated_at: now, user_id: 'mock-user' }
    jobs.unshift(job)
    _notify()
    return clone(job)
  },
  updateJob: (id: string, data: Partial<Job>) => {
    const idx = jobs.findIndex(j => j.id === id)
    if (idx === -1) return null
    jobs[idx] = { ...jobs[idx], ...data, id, updated_at: new Date().toISOString().split('T')[0] }
    _notify()
    return clone(jobs[idx])
  },
  deleteJob: (id: string) => { jobs = jobs.filter(j => j.id !== id); _notify() },

  // Candidates
  getCandidates: () => clone(candidates),
  getCandidate: (id: string) => {
    const c = candidates.find(c => c.id === id)
    if (!c) return null
    const job = jobs.find(j => j.id === c.job_id)
    return { ...clone(c), job: job ? clone(job) : undefined }
  },
  getCandidatesByJob: (jobId: string) => clone(candidates.filter(c => c.job_id === jobId)),
  createCandidate: (data: Omit<Candidate, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const now = new Date().toISOString().split('T')[0]
    const c: Candidate = { ...data, id: uid(), created_at: now, updated_at: now, user_id: 'mock-user' }
    candidates.unshift(c)
    _notify()
    return clone(c)
  },
  updateCandidate: (id: string, data: Partial<Candidate>) => {
    const idx = candidates.findIndex(c => c.id === id)
    if (idx === -1) return null
    candidates[idx] = { ...candidates[idx], ...data, id, updated_at: new Date().toISOString().split('T')[0] }
    _notify()
    return clone(candidates[idx])
  },
  deleteCandidate: (id: string) => { candidates = candidates.filter(c => c.id !== id); _notify() },

  // Communications
  getCommunications: (candidateId?: string) => {
    const list = candidateId ? communications.filter(c => c.candidate_id === candidateId) : communications
    return clone(list.sort((a, b) => new Date(b.contact_time).getTime() - new Date(a.contact_time).getTime()))
  },
  createCommunication: (data: Omit<Communication, 'id' | 'created_at' | 'user_id'>) => {
    const c: Communication = { ...data, id: uid(), created_at: new Date().toISOString(), user_id: 'mock-user' }
    communications.unshift(c)
    if (data.candidate_id && data.next_follow_up_at) {
      const idx = candidates.findIndex(cd => cd.id === data.candidate_id)
      if (idx !== -1) {
        candidates[idx].last_contacted_at = data.contact_time
        candidates[idx].next_follow_up_at = data.next_follow_up_at
      }
    }
    _notify()
    return clone(c)
  },

  // Interviews
  getInterviews: () => clone(interviews.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())),
  getInterviewsByCandidate: (candidateId: string) => clone(interviews.filter(i => i.candidate_id === candidateId)),
  createInterview: (data: Omit<Interview, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const now = new Date().toISOString()
    const iv: Interview = { ...data, id: uid(), created_at: now, updated_at: now, user_id: 'mock-user' }
    interviews.push(iv)
    _notify()
    return clone(iv)
  },
  updateInterview: (id: string, data: Partial<Interview>) => {
    const idx = interviews.findIndex(i => i.id === id)
    if (idx === -1) return null
    interviews[idx] = { ...interviews[idx], ...data, id, updated_at: new Date().toISOString() }
    _notify()
    return clone(interviews[idx])
  },

  // Offers
  getOffers: () => clone(offers),
  getOffer: (id: string) => clone(offers.find(o => o.id === id)) ?? null,
  createOffer: (data: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const now = new Date().toISOString().split('T')[0]
    const o: Offer = { ...data, id: uid(), created_at: now, updated_at: now, user_id: 'mock-user' }
    offers.push(o)
    _notify()
    return clone(o)
  },
  updateOffer: (id: string, data: Partial<Offer>) => {
    const idx = offers.findIndex(o => o.id === id)
    if (idx === -1) return null
    offers[idx] = { ...offers[idx], ...data, id, updated_at: new Date().toISOString().split('T')[0] }
    _notify()
    return clone(offers[idx])
  },

  // Work Logs
  getWorkLogs: () => clone(workLogs.sort((a, b) => b.date.localeCompare(a.date))),
  createWorkLog: (data: Omit<WorkLog, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const now = new Date().toISOString().split('T')[0]
    const wl: WorkLog = { ...data, id: uid(), created_at: now, updated_at: now, user_id: 'mock-user' }
    workLogs.unshift(wl)
    _notify()
    return clone(wl)
  },

  // Todos
  getTodos: () => clone(todos),
  createTodo: (data: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => {
    const t: Todo = { ...data, id: uid(), created_at: new Date().toISOString(), user_id: 'mock-user' }
    todos.unshift(t)
    _notify()
    return clone(t)
  },
  updateTodo: (id: string, data: Partial<Todo>) => {
    const idx = todos.findIndex(t => t.id === id)
    if (idx === -1) return null
    todos[idx] = { ...todos[idx], ...data, id }
    _notify()
    return clone(todos[idx])
  },
  deleteTodo: (id: string) => { todos = todos.filter(t => t.id !== id); _notify() },

  // Dashboard stats
  getDashboardStats: () => {
    const today = new Date().toISOString().split('T')[0]
    return {
      contactsToday: 5,
      newResumesToday: 3,
      interviewsToday: interviews.filter(i => i.scheduled_at?.startsWith(today)).length,
      referralsToday: 1,
      activeOffers: offers.filter(o => !o.is_accepted && !o.is_onboarded).length,
      onboardedThisMonth: offers.filter(o => o.is_onboarded).length,
    }
  },

  getJobsOverview: () => clone(jobs.filter(j => j.status !== 'cancelled').map(j => {
    const jc = candidates.filter(c => c.job_id === j.id)
    return {
      id: j.id,
      title: j.title,
      department: j.department,
      hc: j.hc,
      status: j.status,
      active: jc.filter(c => !c.is_eliminated && c.stage !== 'withdrawn' && c.stage !== 'onboard').length,
      interviews: interviews.filter(i => i.job_id === j.id && i.status !== 'cancelled').length,
      offers: offers.filter(o => o.job_id === j.id).length,
      onboarded: jc.filter(c => c.is_onboarded).length,
    }
  })),

  subscribe: (fn: () => void) => { _listeners.add(fn); return () => { _listeners.delete(fn) } },
  version: () => _v,
}
