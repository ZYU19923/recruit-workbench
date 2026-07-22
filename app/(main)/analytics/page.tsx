'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, Users, UserCheck, CheckCircle, Funnel } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useCandidates, useJobs, useOffers, useInterviews, useJobsOverview } from '@/lib/use-store'
import { STAGE_LABELS } from '@/types'
import type { CandidateStage } from '@/types'

const STAGE_COLORS: Record<string, string> = {
  resume: '#94a3b8', phone: '#38bdf8', referral: '#a78bfa',
  first_interview: '#60a5fa', second_interview: '#818cf8', hrbp: '#c084fc',
  offer: '#fbbf24', onboard: '#34d399', eliminated: '#f87171', withdrawn: '#9ca3af',
}

const CHANNEL_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6b7280', '#ef4444', '#14b8a6']

const FUNNEL_ORDER = ['resume', 'phone', 'referral', 'first_interview', 'second_interview', 'hrbp', 'offer', 'onboard']

export default function AnalyticsPage() {
  const candidates = useCandidates()
  const jobs = useJobs()
  const offers = useOffers()
  const interviews = useInterviews()
  const jobsOverview = useJobsOverview()

  const activeCandidates = candidates.filter(c => c.stage !== 'eliminated' && c.stage !== 'withdrawn')

  const kpis = [
    { label: '总候选人', value: candidates.length, icon: <Users size={18} />, trend: `活跃${activeCandidates.length}` },
    {
      label: '面试通过率',
      value: (() => {
        const completed = interviews.filter(i => i.status === 'completed')
        if (!completed.length) return '-'
        const passed = completed.filter(i => i.result === 'pass').length
        return `${Math.round((passed / completed.length) * 100)}%`
      })(),
      icon: <UserCheck size={18} />,
      trend: '',
    },
    {
      label: 'Offer 接受率',
      value: (() => {
        const decided = offers.filter(o => o.is_accepted === true || (o.is_accepted === false && !o.is_onboarded))
        if (!decided.length) return '-'
        const accepted = offers.filter(o => o.is_accepted).length
        return `${Math.round((accepted / decided.length) * 100)}%`
      })(),
      icon: <CheckCircle size={18} />,
      trend: '',
    },
    { label: '本月入职', value: offers.filter(o => o.is_onboarded).length, icon: <TrendingUp size={18} />, trend: '' },
  ]

  const stageDistribution = useMemo(() => {
    const map: Record<string, number> = {}
    candidates.forEach(c => { map[c.stage] = (map[c.stage] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({
      name: STAGE_LABELS[name as keyof typeof STAGE_LABELS] || name,
      value,
      color: STAGE_COLORS[name as keyof typeof STAGE_COLORS] || '#94a3b8',
    }))
  }, [candidates])

  const monthlyTrend = useMemo(() => {
    return [
      { month: '1月', contacts: 45, interviews: 15, offers: 3 },
      { month: '2月', contacts: 38, interviews: 12, offers: 2 },
      { month: '3月', contacts: 52, interviews: 20, offers: 5 },
      { month: '4月', contacts: 60, interviews: 24, offers: 4 },
      { month: '5月', contacts: 55, interviews: 18, offers: 6 },
      { month: '6月', contacts: 70, interviews: 28, offers: 5 },
      { month: '7月', contacts: 48, interviews: 16, offers: 4 },
    ]
  }, [])

  const channelData = useMemo(() => {
    const map: Record<string, number> = {}
    candidates.forEach(c => {
      const ch = c.source_channel || '其他'
      map[ch] = (map[ch] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [candidates])

  const jobCompletion = useMemo(() => {
    return jobsOverview
      .filter(j => j.status !== 'cancelled')
      .map(j => ({ job: j.title, hc: j.hc, filled: j.onboarded }))
  }, [jobsOverview])

  const funnelData = useMemo(() => {
    const total = candidates.length
    return FUNNEL_ORDER.map(stage => {
      const count = candidates.filter(c => {
        const idx = FUNNEL_ORDER.indexOf(c.stage)
        const stageIdx = FUNNEL_ORDER.indexOf(stage)
        return idx >= stageIdx || c.stage === 'eliminated' || c.stage === 'withdrawn'
      }).length
      return {
        label: STAGE_LABELS[stage as CandidateStage] || stage,
        count: candidates.filter(c => {
          const idx = FUNNEL_ORDER.indexOf(c.stage)
          const stageIdx = FUNNEL_ORDER.indexOf(stage)
          return idx >= stageIdx
        }).length,
        pct: total ? Math.round((count / total) * 100) : 0,
      }
    }).filter(f => f.count > 0)
  }, [candidates])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[rgb(var(--muted-foreground))]">{k.label}</span>
              <span className="text-[rgb(var(--muted-foreground))]">{k.icon}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{k.value}</span>
              {k.trend && <span className="text-xs text-emerald-500">{k.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">候选人阶段分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stageDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">月度招聘趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="contacts" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="联系人数" />
              <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="面试数" />
              <Line type="monotone" dataKey="offers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Offer数" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">渠道来源分布</h3>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={channelData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}`}>
                  {channelData.map((_, index) => (
                    <Cell key={index} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-sm text-[rgb(var(--muted-foreground))]">暂无数据</div>
          )}
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
          <h3 className="mb-4 text-sm font-semibold">岗位完成进度</h3>
          <div className="space-y-4">
            {jobCompletion.map((j) => (
              <div key={j.job}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{j.job}</span>
                  <span className="text-[rgb(var(--muted-foreground))]">{j.filled}/{j.hc}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[rgb(var(--muted))]">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all',
                      j.filled >= j.hc ? 'bg-emerald-500' : j.filled > 0 ? 'bg-primary-500' : 'bg-[rgb(var(--border))]'
                    )}
                    style={{ width: `${Math.min(100, (j.filled / Math.max(j.hc, 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-5">
        <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
          <Funnel size={16} />
          招聘转化漏斗
        </h3>
        <div className="space-y-2">
          {funnelData.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-20 text-sm text-right text-[rgb(var(--muted-foreground))]">{s.label}</span>
              <div className="flex-1 flex items-center gap-2">
                <div
                  className="h-7 rounded bg-primary-500 flex items-center justify-end px-2 text-xs text-white font-medium min-w-[2rem]"
                  style={{ width: `${Math.max(s.pct, 5)}%`, opacity: 1 - i * 0.1 }}
                >
                  {s.count}
                </div>
                <span className="text-xs text-[rgb(var(--muted-foreground))]">{s.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
