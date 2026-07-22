import { cn } from '@/lib/utils'

interface DataCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export function DataCard({ label, value, icon, trend, className }: DataCardProps) {
  return (
    <div className={cn('rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[rgb(var(--muted-foreground))]">{label}</span>
        {icon && <span className="text-[rgb(var(--muted-foreground))]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={cn('text-xs', trend.positive ? 'text-emerald-500' : 'text-red-500')}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
