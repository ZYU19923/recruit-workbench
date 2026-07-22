'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { useTheme } from '@/components/layout/ThemeProvider'
import { db } from '@/lib/storage'
import { useAuth } from '@/components/layout/AuthProvider'
import { cn } from '@/lib/utils'
import { Sun, Moon, User, Download, Database, Globe } from 'lucide-react'

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const BOM = '﻿'
  const csv = BOM + [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'data' | 'notifications'>('account')

  const exportCandidates = () => {
    const candidates = db.getCandidates()
    const jobs = db.getJobs()
    downloadCSV(
      `候选人_${new Date().toISOString().slice(0, 10)}.csv`,
      ['姓名', '岗位', '电话', '邮箱', '年龄', '学历', '学校', '专业', '工作年限', '当前公司', '当前职位', '期望薪资', '期望城市', '渠道', '阶段', '简历备注'],
      candidates.map(c => {
        const job = jobs.find(j => j.id === c.job_id)
        return [c.name, job?.title ?? '', c.phone, c.email, String(c.age ?? ''), c.education, c.school, c.major, String(c.work_years ?? ''), c.current_company, c.current_position, c.expected_salary, c.expected_city, c.source_channel, c.stage, c.resume_notes]
      })
    )
  }

  const exportJobs = () => {
    const jobs = db.getJobs()
    downloadCSV(
      `岗位_${new Date().toISOString().slice(0, 10)}.csv`,
      ['岗位名称', '部门', '负责人', 'HC', '地点', '薪资范围', '状态', '要求', '渠道'],
      jobs.map(j => [j.title, j.department, j.leader, String(j.hc), j.location, j.salary_range, j.status, j.requirements_must, j.channels.join('/')])
    )
  }

  const exportWorkLogs = () => {
    const logs = db.getWorkLogs()
    downloadCSV(
      `工作记录_${new Date().toISOString().slice(0, 10)}.csv`,
      ['日期', '完成事项', '联系人数', '推荐人数', '面试数', '推进岗位', '问题', '明日计划'],
      logs.map(l => [l.date, l.completed_items, String(l.contacts_count), String(l.referrals_count), String(l.interviews_count), l.jobs_progressed, l.issues, l.tomorrow_plan])
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-lg font-semibold mb-6">设置</h2>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'account', label: '账号', icon: <User size={14} /> },
          { key: 'appearance', label: '外观', icon: activeTab === 'appearance' && theme === 'dark' ? <Moon size={14} /> : <Sun size={14} /> },
          { key: 'data', label: '数据', icon: <Database size={14} /> },
          { key: 'notifications', label: '通知', icon: <Globe size={14} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
              activeTab === tab.key
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))]'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'account' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">账号信息</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">邮箱</label>
              <input type="email" defaultValue={user?.email ?? 'user@example.com'} className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">昵称</label>
              <input type="text" defaultValue="招聘负责人" className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm" />
            </div>
            <Button>保存修改</Button>
          </div>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">外观设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">主题模式</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">切换浅色/深色模式</div>
              </div>
              <button
                onClick={toggleTheme}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform flex items-center justify-center',
                    theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0.5'
                  )}
                >
                  {theme === 'dark' ? <Moon size={12} className="text-primary-600" /> : <Sun size={12} className="text-amber-500" />}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">数据管理</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">导出所有候选人</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div>
              </div>
              <Button variant="outline" size="sm" onClick={exportCandidates}><Download size={14} />导出</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">导出岗位数据</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div>
              </div>
              <Button variant="outline" size="sm" onClick={exportJobs}><Download size={14} />导出</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">导出工作记录</div>
                <div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div>
              </div>
              <Button variant="outline" size="sm" onClick={exportWorkLogs}><Download size={14} />导出</Button>
            </div>
            <hr className="border-[rgb(var(--border))]" />
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">数据同步状态</div>
                <div className="text-xs text-emerald-500">已同步</div>
              </div>
              <Button variant="outline" size="sm">立即同步</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <h3 className="mb-4 text-sm font-semibold">通知设置</h3>
          <div className="space-y-4">
            {[
              { label: '候选人超期未跟进提醒', desc: '超过3天自动提醒', checked: true },
              { label: '今日面试提醒', desc: '提前提醒今日面试安排', checked: true },
              { label: 'Offer 待确认提醒', desc: 'Offer 发出后提醒跟进', checked: true },
              { label: 'Leader 反馈提醒', desc: '需要 Leader 反馈时提醒', checked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))]">{item.desc}</div>
                </div>
                <button
                  className={cn(
                    'relative h-5 w-9 rounded-full transition-colors',
                    item.checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                >
                  <div
                    className={cn(
                      'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                      item.checked ? 'translate-x-4.5' : 'translate-x-0.5'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
