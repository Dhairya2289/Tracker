"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  color?: string
  height?: number
  className?: string
}

export function ProgressBar({
  value,
  max,
  color = "var(--primary)",
  height = 4,
  className,
}: ProgressBarProps) {
  const pct = Math.min((value / (max || 1)) * 100, 100)

  return (
    <div
      className={cn("w-full rounded-full overflow-hidden bg-muted/20", className)}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: color,
        }}
      />
    </div>
  )
}
