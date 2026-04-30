"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { EXAM_DATE } from "@/lib/data"

const colorMap = {
  coral: "oklch(0.70 0.20 25)",
  lime: "oklch(0.75 0.18 145)",
  cyan: "oklch(0.78 0.12 200)",
  amber: "oklch(0.78 0.15 85)",
}

export function StatsBar() {
  const { meta, getTodayData, getOverallPct } = useStore()
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    const diff = Math.ceil((EXAM_DATE.getTime() - new Date().getTime()) / 86400000)
    setDaysLeft(diff)
  }, [])

  const todayData = getTodayData()
  const overallPct = getOverallPct()

  const stats = [
    { label: "Days Left", value: daysLeft !== null && daysLeft > 0 ? daysLeft : "0", color: colorMap.coral },
    { label: "Streak", value: `${meta.streak}`, color: colorMap.lime },
    { label: "Today", value: `${overallPct}%`, color: colorMap.cyan },
    { label: "MCQs", value: todayData.mcqs, color: colorMap.amber },
  ]

  return (
    <div className="grid grid-cols-4 border-b border-border bg-card/50">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative py-3 px-2 text-center border-r border-border/50 last:border-r-0"
        >
          <div
            className="text-2xl font-bold leading-none tracking-tight"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mt-1">
            {stat.label}
          </div>
          <div
            className="absolute bottom-0 left-[15%] right-[15%] h-[2px] rounded-t"
            style={{ background: stat.color, boxShadow: `0 0 6px ${stat.color}` }}
          />
        </div>
      ))}
    </div>
  )
}
