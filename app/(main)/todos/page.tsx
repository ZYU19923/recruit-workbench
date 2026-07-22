'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTodos } from '@/lib/use-store'
import { db } from '@/lib/mock-data'
import { Button } from '@/components/shared/Button'
import { CheckCircle2, AlertCircle, Clock, Bell, Plus, Calendar } from 'lucide-react'

import type { TodoPriority, TodoType } from '@/types'

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  high: <AlertCircle size={14} className="text-red-500" />,
  medium: <Bell size={14} className="text-amber-500" />,
  low: <Clock size={14} className="text-slate-400" />,
}

export default function TodosPage() {
  const todos = useTodos()
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low' | 'done'>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', priority: 'medium' as TodoPriority, due_date: '', todo_type: 'other' as TodoType })

  const toggle = (id: string) => {
    const t = todos.find(x => x.id === id)
    if (t) db.updateTodo(id, { is_completed: !t.is_completed })
  }

  const addTodo = () => {
    if (!form.title.trim()) return
    db.createTodo({
      title: form.title.trim(),
      description: '',
      priority: form.priority,
      is_completed: false,
      due_date: form.due_date || null,
      related_job_id: null,
      related_candidate_id: null,
      todo_type: form.todo_type,
    })
    setForm({ title: '', priority: 'medium', due_date: '', todo_type: 'other' })
    setShowForm(false)
  }

  const deleteTodo = (id: string) => { db.deleteTodo(id) }

  const filtered = todos.filter((t) => {
    if (filter === 'done') return t.is_completed
    if (filter === 'all') return !t.is_completed
    return !t.is_completed && t.priority === filter
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {([
            { value: 'all', label: '全部待办' },
            { value: 'high', label: '高优先级' },
            { value: 'medium', label: '中优先级' },
            { value: 'low', label: '低优先级' },
            { value: 'done', label: '已完成' },
          ] as const).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--accent))]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus size={14} />新增待办</Button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="待办事项标题..."
            className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') addTodo() }}
          />
          <div className="flex gap-3">
            <select value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as any }))}
              className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-xs">
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
            <input type="date" value={form.due_date} onChange={(e) => setForm(f => ({ ...f, due_date: e.target.value }))}
              className="rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-2 py-1.5 text-xs" />
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>取消</Button>
            <Button size="sm" onClick={addTodo}>添加</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((todo) => (
          <div
            key={todo.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 transition-all group',
              todo.is_completed && 'opacity-60'
            )}
          >
            <button
              onClick={() => toggle(todo.id)}
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
                todo.is_completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : todo.priority === 'high' ? 'border-red-300 hover:border-red-500'
                  : todo.priority === 'medium' ? 'border-amber-300 hover:border-amber-500'
                  : 'border-[rgb(var(--border))] hover:border-[rgb(var(--ring))]'
              )}
            >
              {todo.is_completed && <CheckCircle2 size={14} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-medium', todo.is_completed && 'line-through text-[rgb(var(--muted-foreground))]')}>
                  {todo.title}
                </span>
                {PRIORITY_ICONS[todo.priority]}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[rgb(var(--muted-foreground))]">
                {todo.due_date && <span className="flex items-center gap-1"><Calendar size={12} />{todo.due_date}</span>}
              </div>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="shrink-0 rounded p-1 text-[rgb(var(--muted-foreground))] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
            >
              <AlertCircle size={14} />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-[rgb(var(--muted-foreground))]">
          <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-400" />
          <p className="text-sm">全部处理完成</p>
        </div>
      )}
    </div>
  )
}
