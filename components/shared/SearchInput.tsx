'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = '搜索...', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted-foreground))]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[rgb(var(--input))] bg-[rgb(var(--background))] py-2 pl-9 pr-3 text-sm placeholder:text-[rgb(var(--muted-foreground))] focus:border-[rgb(var(--ring))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--ring))]"
      />
    </div>
  )
}
