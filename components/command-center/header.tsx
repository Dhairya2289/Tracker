"use client"

import { useEffect, useState } from "react"
import { Target } from "lucide-react"
import { EXAM_DATE } from "@/lib/data"

export function Header() {
  const [time, setTime] = useState<string>("--:--")
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      )
      const diff = Math.ceil((EXAM_DATE.getTime() - now.getTime()) / 86400000)
      setDaysLeft(diff)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/60">
      <div className="flex items-center justify-between px-4 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-foreground tracking-tight text-base leading-tight">
              Command Center
            </div>
            <div className="font-mono text-[11px] text-muted-foreground tracking-wide">
              MDCAT 2025
            </div>
          </div>
        </div>

        {/* Time & Countdown */}
        <div className="text-right">
          <div className="font-mono text-xl font-bold text-primary tracking-wider leading-none drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]">
            {time}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground mt-1.5 tracking-wider uppercase">
            {daysLeft !== null && daysLeft > 0 ? (
              <span className="text-destructive/80 font-semibold">{daysLeft}D to MDCAT</span>
            ) : daysLeft === 0 ? (
              <span className="text-destructive font-semibold">EXAM DAY</span>
            ) : (
              <span className="text-primary">Complete</span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
