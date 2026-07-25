'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { ArrowLeft, Save, Upload, FileText, X } from 'lucide-react'
import { db } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import type { CandidateStage } from '@/types'

export default function NewCandidatePage() {
  const router = useRouter()
  const jobs = db.getJobs().filter(j => j.status === 'hiring')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resumeFile, setResumeFile] = useState<{ data: string; name: string; type: string } | null>(null)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', age: '', job_id: '',
    education: '', school: '', major: '', work_years: '',
    current_company: '', current_position: '', expected_salary: '',
    expected_city: '', source_channel: '', stage: 'resume' as CandidateStage,
    resume_notes: '', communication_notes: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setResumeFile({ data: reader.result as string, name: file.name, type: file.type })
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setResumeFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const saved = db.createCandidate({
      ...form,
      age: form.age ? parseInt(form.age) : null,
      work_years: form.work_years ? parseInt(form.work_years) : null,
      is_recommended: false, is_interview_scheduled: false,
      is_offered: false, is_onboarded: false, is_eliminated: false,
      elimination_reason: '', last_contacted_at: null, next_follow_up_at: null,
      resume_file: null,
      resume_file_name: resumeFile ? resumeFile.name : null,
    })
    // Persist file to IndexedDB, then update candidate with file reference
    if (resumeFile) {
      await db.saveFile(saved.id, resumeFile)
      db.updateCandidate(saved.id, { resume_file: saved.id })
    }
  }

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/candidates" className="rounded-md p-1 hover:bg-[rgb(var(--accent))]">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-lg font-semibold">新增候选人</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">基本信息</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">姓名 *</label><input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" required /></div>
            <div><label className="mb-1 block text-sm font-medium">手机号</label><input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">邮箱</label><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">年龄</label><input type="number" value={form.age} onChange={(e) => update('age', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">所属岗位 *</label><select value={form.job_id} onChange={(e) => update('job_id', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" required><option value="">请选择岗位</option>{jobs.map((j) => (<option key={j.id} value={j.id}>{j.title}</option>))}</select></div>
            <div><label className="mb-1 block text-sm font-medium">来源渠道</label><input type="text" value={form.source_channel} onChange={(e) => update('source_channel', e.target.value)} placeholder="Boss直聘 / 猎聘 / 内推等" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">简历文件</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          {resumeFile ? (
            <div className="flex items-center justify-between rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-500" />
                <div>
                  <div className="text-sm font-medium">{resumeFile.name}</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">
                    {(resumeFile.data.length / 1024).toFixed(0)} KB
                  </div>
                </div>
              </div>
              <button type="button" onClick={removeFile} className="rounded p-1 hover:bg-red-50 hover:text-red-600">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-[rgb(var(--border))] p-6 text-sm text-[rgb(var(--muted-foreground))] hover:border-primary-400 hover:text-primary-600 transition-colors"
            >
              <Upload size={18} />
              上传简历 (PDF/DOC/DOCX, 最大 5MB)
            </button>
          )}
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">教育及工作背景</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">学历</label><input type="text" value={form.education} onChange={(e) => update('education', e.target.value)} placeholder="本科 / 硕士 / 博士" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">学校</label><input type="text" value={form.school} onChange={(e) => update('school', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">专业</label><input type="text" value={form.major} onChange={(e) => update('major', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">工作年限</label><input type="text" value={form.work_years} onChange={(e) => update('work_years', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">当前公司</label><input type="text" value={form.current_company} onChange={(e) => update('current_company', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">当前岗位</label><input type="text" value={form.current_position} onChange={(e) => update('current_position', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">期望薪资</label><input type="text" value={form.expected_salary} onChange={(e) => update('expected_salary', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">期望城市</label><input type="text" value={form.expected_city} onChange={(e) => update('expected_city', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">备注信息</h3>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">简历备注</label><textarea value={form.resume_notes} onChange={(e) => update('resume_notes', e.target.value)} rows={3} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" placeholder="对候选人简历的整体评价和备注..." /></div>
            <div><label className="mb-1 block text-sm font-medium">沟通备注</label><textarea value={form.communication_notes} onChange={(e) => update('communication_notes', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" placeholder="初步沟通的备注..." /></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/candidates"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit"><Save size={16} />保存候选人</Button>
        </div>
      </form>
    </div>
  )
}
