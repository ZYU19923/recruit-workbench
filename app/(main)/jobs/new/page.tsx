'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { ArrowLeft, Save } from 'lucide-react'
import { db } from '@/lib/storage'
import { useRouter } from 'next/navigation'

export default function NewJobPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', department: '', leader: '', hc: 1, location: '',
    salary_range: '', jd: '', requirements_must: '', requirements_nice: '',
    education_requirement: '', experience_requirement: '', channels: '',
    expected_completion_date: '', notes: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    db.createJob({
      ...form,
      channels: form.channels ? form.channels.split(',').map(s => s.trim()) : [],
      status: 'hiring',
    })
    router.push('/jobs')
  }

  const update = (key: string, value: string | number) => setForm(f => ({ ...f, [key]: value }))

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/jobs" className="rounded-md p-1 hover:bg-[rgb(var(--accent))]">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-lg font-semibold">新增岗位</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">基本信息</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">岗位名称 *</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)}
                className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm focus:border-[rgb(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--ring))]" required />
            </div>
            <div><label className="mb-1 block text-sm font-medium">所属部门</label><input type="text" value={form.department} onChange={(e) => update('department', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">对接 Leader</label><input type="text" value={form.leader} onChange={(e) => update('leader', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">HC</label><input type="number" value={form.hc} onChange={(e) => update('hc', parseInt(e.target.value) || 0)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" min="1" /></div>
            <div><label className="mb-1 block text-sm font-medium">工作地点</label><input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">薪资范围</label><input type="text" value={form.salary_range} onChange={(e) => update('salary_range', e.target.value)} placeholder="如: 30-50K" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">预计完成时间</label><input type="date" value={form.expected_completion_date} onChange={(e) => update('expected_completion_date', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">岗位描述与要求</h3>
          <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">岗位描述 (JD)</label><textarea value={form.jd} onChange={(e) => update('jd', e.target.value)} rows={4} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">必须条件</label><textarea value={form.requirements_must} onChange={(e) => update('requirements_must', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">优先条件</label><textarea value={form.requirements_nice} onChange={(e) => update('requirements_nice', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-sm font-medium">学历要求</label><input type="text" value={form.education_requirement} onChange={(e) => update('education_requirement', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
              <div><label className="mb-1 block text-sm font-medium">经验要求</label><input type="text" value={form.experience_requirement} onChange={(e) => update('experience_requirement', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            </div>
            <div><label className="mb-1 block text-sm font-medium">招聘渠道</label><input type="text" value={form.channels} onChange={(e) => update('channels', e.target.value)} placeholder="多个渠道用逗号分隔" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">备注</label><textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/jobs"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit" disabled={saving}><Save size={16} />保存岗位</Button>
        </div>
      </form>
    </div>
  )
}
