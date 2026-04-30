"use client"

import { useStore } from "@/lib/store"
import { PLAN, SUBJ_COLOR } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.68 0.14 155)",
  coral: "oklch(0.65 0.16 25)",
  cyan: "oklch(0.72 0.10 200)",
  amber: "oklch(0.72 0.12 85)",
  violet: "oklch(0.68 0.12 280)",
  orange: "oklch(0.70 0.12 55)",
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
    <div className="px-4 py-5 space-y-4 pb-24">
      {/* Progress Summary */}
      <Card>
        <CardContent className="p-5 text-center">
          <div className="font-mono text-[10px] text-muted-foreground/70 tracking-widest mb-3 uppercase">24-Day Plan Progress</div>
          <div className="text-4xl font-bold text-primary leading-none tracking-tight">{planPct}%</div>
          <div className="font-mono text-xs text-muted-foreground mt-2">{totalDone} of {totalTasks} tasks complete</div>
          <ProgressBar value={totalDone} max={totalTasks} color={colorMap.lime} height={5} className="mt-4" />
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
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border/60" />
                <div
                  className="font-semibold text-xs tracking-widest px-4 py-1.5 rounded-full border"
                  style={{ color: phaseColor, borderColor: `${phaseColor}40`, background: `${phaseColor}10` }}
                >
                  {day.phase}
                </div>
                <div className="flex-1 h-px bg-border/60" />
              </div>
            )}

            {/* Section Label */}
            {showSection && (
              <div className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase my-4">
                // {day.section}
              </div>
            )}

            {/* Day Row */}
            <div
              className={cn(
                "rounded-xl border overflow-hidden transition-all",
                isToday && "border-destructive/40",
                isDone && "border-primary/25",
                !isToday && !isDone && "border-border/60"
              )}
            >
              <button
                onClick={() => store.toggleDayOpen(day.day)}
                className="w-full flex items-center gap-3 p-3.5 active:opacity-80"
              >
                <div
                  className={cn(
                    "text-xl font-bold min-w-[32px] tabular-nums",
                    isToday ? "text-destructive" : isDone ? "text-primary" : "text-muted-foreground/50"
                  )}
                >
                  {String(day.day).padStart(2, "0")}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/70">
                      {dateObj.getDate()} {monthNames[dateObj.getMonth()]}
                    </span>
                    {isToday && (
                      <span className="bg-destructive text-white text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
                        TODAY
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{day.section}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {subjDots.map((subj) => (
                      <div
                        key={subj}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: colorMap[SUBJ_COLOR[subj]] || colorMap.lime }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-mono text-xs font-semibold min-w-[32px] text-right"
                    style={{ color: isDone ? colorMap.lime : "var(--muted-foreground)" }}
                  >
                    {pct}%
                  </span>
                  <ChevronDown
                    className={cn("w-4 h-4 text-muted-foreground/60 transition-transform", isOpen && "rotate-180")}
                  />
                </div>
              </button>

              {/* Tasks */}
              {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-border/40 space-y-1.5">
                  {day.tasks.map((task) => {
                    const done = store.mdcatDone[task.id]
                    const color = colorMap[SUBJ_COLOR[task.subj]] || colorMap.lime
                    return (
                      <button
                        key={task.id}
                        onClick={() => store.toggleMdcatTask(task.id)}
                        className="w-full flex items-center gap-3 py-2.5 text-left active:opacity-80"
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                            done ? "bg-primary border-primary" : "border-border/80"
                          )}
                        >
                          {done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
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
