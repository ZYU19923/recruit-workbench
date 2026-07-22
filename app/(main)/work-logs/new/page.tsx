'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/storage'
import { useRouter } from 'next/navigation'

export default function NewWorkLogPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    completed_items: '',
    contacts_count: 0,
    referrals_count: 0,
    interviews_count: 0,
    jobs_progressed: '',
    issues: '',
    tomorrow_plan: '',
  })

  const update = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    db.createWorkLog(form)
    router.push('/work-logs')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/work-logs" className="rounded-md p-1 hover:bg-[rgb(var(--accent))]">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-lg font-semibold">记录今日工作</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">日期 *</label>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label className="mb-1 block text-sm font-medium">今日联系人数</label><input type="number" value={form.contacts_count} onChange={(e) => update('contacts_count', parseInt(e.target.value) || 0)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" min="0" /></div>
              <div><label className="mb-1 block text-sm font-medium">今日推荐人数</label><input type="number" value={form.referrals_count} onChange={(e) => update('referrals_count', parseInt(e.target.value) || 0)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" min="0" /></div>
              <div><label className="mb-1 block text-sm font-medium">今日面试数</label><input type="number" value={form.interviews_count} onChange={(e) => update('interviews_count', parseInt(e.target.value) || 0)} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" min="0" /></div>
            </div>
            <div><label className="mb-1 block text-sm font-medium">今日推进岗位</label><input type="text" value={form.jobs_progressed} onChange={(e) => update('jobs_progressed', e.target.value)} placeholder="多个岗位用逗号分隔" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">完成事项 *</label><textarea value={form.completed_items} onChange={(e) => update('completed_items', e.target.value)} rows={4} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" placeholder="今天完成了哪些招聘工作..." required /></div>
            <div><label className="mb-1 block text-sm font-medium">遇到的问题</label><textarea value={form.issues} onChange={(e) => update('issues', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
            <div><label className="mb-1 block text-sm font-medium">明日计划</label><textarea value={form.tomorrow_plan} onChange={(e) => update('tomorrow_plan', e.target.value)} rows={2} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" /></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/work-logs"><Button variant="outline" type="button">取消</Button></Link>
          <Button type="submit"><Save size={16} />保存记录</Button>
        </div>
      </form>
    </div>
  )
}
