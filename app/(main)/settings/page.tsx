'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { useTheme } from '@/components/layout/ThemeProvider'
import { db } from '@/lib/storage'
import { useAuth } from '@/components/layout/AuthProvider'
import { cn } from '@/lib/utils'
import { Sun, Moon, User, Download, Database, Upload } from 'lucide-react'
import { useRef } from 'react'

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
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'data'>('account')
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

  const handleExportAll = () => {
    const json = db.exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `招聘工作台_全量备份_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = db.importAll(reader.result as string)
      if (result.success) {
        setImportMsg({ type: 'success', text: '数据导入成功！页面将刷新以加载新数据。' })
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setImportMsg({ type: 'error', text: result.error })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-lg font-semibold mb-6">设置</h2>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'account', label: '账号', icon: <User size={14} /> },
          { key: 'appearance', label: '外观', icon: activeTab === 'appearance' && theme === 'dark' ? <Moon size={14} /> : <Sun size={14} /> },
          { key: 'data', label: '数据', icon: <Database size={14} /> },
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
          {importMsg && (
            <div className={`mb-4 rounded-md p-3 text-sm ${importMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
              {importMsg.text}
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800 p-4">
              <div className="flex items-start gap-3">
                <Upload size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium">全量备份 · 导入/导出</div>
                  <div className="text-xs text-[rgb(var(--muted-foreground))] mt-1">
                    导出全部数据（岗位、候选人、沟通记录、面试、Offer、日志、待办）为 JSON 文件。可在另一台电脑导入恢复所有数据。
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={handleExportAll}><Download size={14} />导出备份</Button>
                    <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                      <Upload size={14} />导入备份
                    </Button>
                    <input ref={fileRef} type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[rgb(var(--border))]" />

            <h4 className="text-sm font-semibold">CSV 导出</h4>
            <div className="flex items-center justify-between py-2">
              <div><div className="text-sm font-medium">导出所有候选人</div><div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div></div>
              <Button variant="outline" size="sm" onClick={exportCandidates}><Download size={14} />导出</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><div className="text-sm font-medium">导出岗位数据</div><div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div></div>
              <Button variant="outline" size="sm" onClick={exportJobs}><Download size={14} />导出</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><div className="text-sm font-medium">导出工作记录</div><div className="text-xs text-[rgb(var(--muted-foreground))]">导出 CSV 格式</div></div>
              <Button variant="outline" size="sm" onClick={exportWorkLogs}><Download size={14} />导出</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
