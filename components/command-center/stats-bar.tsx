"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { EXAM_DATE } from "@/lib/data"

const colorMap = {
  coral: "oklch(0.65 0.16 25)",
  lime: "oklch(0.68 0.14 155)",
  cyan: "oklch(0.72 0.10 200)",
  amber: "oklch(0.72 0.12 85)",
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
    { label: "Streak", value: meta.streak > 0 ? `${meta.streak}🔥` : "0", color: colorMap.lime },
    { label: "Today", value: `${overallPct}%`, color: colorMap.cyan },
    { label: "MCQs", value: todayData.mcqs, color: colorMap.amber },
  ]

  return (
    <div className="grid grid-cols-4 bg-card border-b border-border/60">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative py-3.5 px-2 text-center"
        >
          <div
            className="text-xl font-semibold leading-none tracking-tight"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground/80 tracking-wider uppercase mt-1.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
