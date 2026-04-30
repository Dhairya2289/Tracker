"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
import { EXAM_DATE } from "@/lib/data"

export function Header() {
  const [time, setTime] = useState<string>("--:--:--")
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border-2 border-primary flex items-center justify-center shadow-[0_0_12px_rgba(var(--primary),0.3)]">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-bold text-foreground tracking-widest text-sm">COMMAND</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-wider">CENTER MDCAT</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl font-bold text-primary tracking-wide" style={{ textShadow: "0 0 16px rgba(var(--primary), 0.4)" }}>
            {time}
          </div>
          <div className="font-mono text-[10px] text-destructive tracking-wider">
            {daysLeft !== null && daysLeft > 0
              ? `EXAM IN ${daysLeft} DAYS`
              : daysLeft === 0
              ? "EXAM TODAY"
              : "EXAM DONE"}
          </div>
        </div>
      </div>
    </header>
  )
}
