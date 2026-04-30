"use client"

import { useStore } from "@/lib/store"
import { PLAN, SUBJ_COLOR } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.75 0.18 145)",
  coral: "oklch(0.70 0.20 25)",
  cyan: "oklch(0.78 0.12 200)",
  amber: "oklch(0.78 0.15 85)",
  violet: "oklch(0.72 0.15 290)",
  orange: "oklch(0.75 0.15 55)",
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function PlanView() {
  const store = useStore()
  const totalDone = store.mdcatTotalDone()
  const totalTasks = store.mdcatTotalTasks()
  const planPct = Math.round((totalDone / totalTasks) * 100)
  const today = todayKey()

  let lastPhase = ""
  let lastSection = ""

  return (
    <div className="p-4 space-y-3 pb-20">
      {/* Progress Summary */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">24-DAY PLAN PROGRESS</div>
          <div className="text-4xl font-bold text-primary leading-none">{planPct}%</div>
          <div className="font-mono text-xs text-muted-foreground mt-1">{totalDone} of {totalTasks} tasks complete</div>
          <ProgressBar value={totalDone} max={totalTasks} color={colorMap.lime} height={6} className="mt-3" />
        </CardContent>
      </Card>

      {/* Plan Days */}
      {PLAN.map((day) => {
        const showPhase = day.phase !== lastPhase
        const showSection = day.section !== lastSection
        const isToday = day.date === today
        const isDone = store.mdcatDayDone(day)
        const isOpen = store.mdcatOpen.includes(String(day.day)) || (isToday && !isDone)
        const pct = store.mdcatDayPct(day)
        const dateObj = new Date(day.date + "T00:00:00")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const subjDots = [...new Set(day.tasks.map((t) => t.subj))]

        if (showPhase) lastPhase = day.phase
        if (showSection) lastSection = day.section

        const phaseColor = day.phase === "PHASE 1" ? colorMap.coral : day.phase === "PHASE 2" ? colorMap.lime : colorMap.cyan

        return (
          <div key={day.day}>
            {/* Phase Divider */}
            {showPhase && (
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <div
                  className="font-semibold text-sm tracking-widest px-3 py-1 rounded border"
                  style={{ color: phaseColor, borderColor: `${phaseColor}60`, background: `${phaseColor}10` }}
                >
                  {day.phase}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            {/* Section Label */}
            {showSection && (
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase my-3">
                // {day.section}
              </div>
            )}

            {/* Day Row */}
            <div
              className={cn(
                "rounded-lg border overflow-hidden transition-all",
                isToday && "border-destructive/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
                isDone && "border-primary/30",
                !isToday && !isDone && "border-border"
              )}
            >
              <button
                onClick={() => store.toggleDayOpen(day.day)}
                className="w-full flex items-center gap-3 p-3"
              >
                <div
                  className={cn(
                    "text-2xl font-bold min-w-[36px]",
                    isToday ? "text-destructive" : isDone ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {String(day.day).padStart(2, "0")}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                    {dateObj.getDate()} {monthNames[dateObj.getMonth()]}
                    {isToday && (
                      <span className="bg-destructive text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest">
                        TODAY
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{day.section}</div>
                </div>
                <div className="flex items-center gap-2">
                  {subjDots.map((subj) => (
                    <div
                      key={subj}
                      className="w-[5px] h-[5px] rounded-full"
                      style={{ background: colorMap[SUBJ_COLOR[subj]] || colorMap.lime }}
                    />
                  ))}
                  <span
                    className="font-mono text-xs font-bold min-w-[32px] text-right"
                    style={{ color: isDone ? colorMap.lime : "var(--muted-foreground)" }}
                  >
                    {pct}%
                  </span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                  />
                </div>
              </button>

              {/* Tasks */}
              {isOpen && (
                <div className="px-3 pb-3 pt-2 border-t border-border/50 space-y-1">
                  {day.tasks.map((task) => {
                    const done = store.mdcatDone[task.id]
                    const color = colorMap[SUBJ_COLOR[task.subj]] || colorMap.lime
                    return (
                      <button
                        key={task.id}
                        onClick={() => store.toggleMdcatTask(task.id)}
                        className="w-full flex items-center gap-2 py-2 px-1 text-left"
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                            done ? "bg-primary border-primary" : "border-border"
                          )}
                        >
                          {done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className={cn("flex-1 text-sm", done && "text-muted-foreground line-through")}>
                          {task.text}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
