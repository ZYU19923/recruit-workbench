'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { StickyNote, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'

interface Memo {
  id: string
  text: string
  createdAt: string
}

const STORAGE_KEY = 'recruit-workbench-memos'

function loadMemos(): Memo[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMemos(memos: Memo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
}

export function MemoPanel() {
  const [open, setOpen] = useState(false)
  const [memos, setMemos] = useState<Memo[]>([])
  const [text, setText] = useState('')

  useEffect(() => { setMemos(loadMemos()) }, [])

  const addMemo = () => {
    if (!text.trim()) return
    const memo: Memo = {
      id: Date.now().toString(36),
      text: text.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    const next = [memo, ...memos]
    setMemos(next)
    saveMemos(next)
    setText('')
  }

  const deleteMemo = (id: string) => {
    const next = memos.filter(m => m.id !== id)
    setMemos(next)
    saveMemos(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addMemo()
    }
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 rounded-l-lg border border-r-0 border-[rgb(var(--border))] bg-[rgb(var(--card))] px-1.5 py-3 text-[rgb(var(--muted-foreground))] hover:text-primary-500 transition-all shadow-sm',
          open && 'right-72'
        )}
        title="备注栏"
      >
        {open ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!open && <StickyNote size={14} />}
      </button>

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-30 h-screen w-72 border-l border-[rgb(var(--border))] bg-[rgb(var(--card))] transition-transform duration-200 flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[rgb(var(--border))] shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <StickyNote size={16} className="text-primary-500" />
            备注备忘录
          </div>
          <span className="text-xs text-[rgb(var(--muted-foreground))]">{memos.length} 条</span>
        </div>

        {/* Input */}
        <div className="p-3 border-b border-[rgb(var(--border))]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="写一条备注... (Enter 保存)"
            rows={2}
            className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] px-3 py-2 text-sm resize-none focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 placeholder:text-xs"
          />
          <button
            onClick={addMemo}
            disabled={!text.trim()}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={14} />
            添加备注
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {memos.length === 0 && (
            <div className="py-12 text-center">
              <StickyNote size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs text-[rgb(var(--muted-foreground))]">暂无备注</p>
              <p className="text-xs text-[rgb(var(--muted-foreground))] mt-0.5">记录补充细节、待办小事项</p>
            </div>
          )}
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="group rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--background))] p-3 text-sm hover:border-primary-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 whitespace-pre-wrap text-xs leading-relaxed">{memo.text}</p>
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="shrink-0 rounded p-0.5 text-[rgb(var(--muted-foreground))] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="mt-2 text-[10px] text-[rgb(var(--muted-foreground))]">{memo.createdAt}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
