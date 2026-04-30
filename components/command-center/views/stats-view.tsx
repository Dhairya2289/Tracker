"use client"

import { useStore } from "@/lib/store"
import { PLAN, SUBJ_COLOR, TOTAL_KCAL, TOTAL_PRO } from "@/lib/data"
import { ProgressRing } from "../progress-ring"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
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

export function StatsView() {
  const store = useStore()
  const todayData = store.getTodayData()
  const op = store.getOverallPct()
  const bd = store.getBlocksDone()
  const { blocks: bt, mcq: mt } = store.getDayTargets()
  const kcalDone = store.getKcalDone()
  const proDone = store.getProDone()
  const { done: fd, total: ft } = store.getFitDone()
  const oColor = op >= 80 ? colorMap.lime : op >= 50 ? colorMap.amber : colorMap.coral

  // Subject stats
  const subjStats: Record<string, { total: number; done: number }> = {}
  PLAN.forEach((d) =>
    d.tasks.forEach((t) => {
      if (!subjStats[t.subj]) subjStats[t.subj] = { total: 0, done: 0 }
      subjStats[t.subj].total++
      if (store.mdcatDone[t.id]) subjStats[t.subj].done++
    })
  )
  const sNames: Record<string, string> = { bio: "Biology", chem: "Chemistry", eng: "English", gat: "GAT", rev: "Revision", phys: "Physics" }

  // Week data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    return {
      label: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()],
      pct: k === todayKey() ? op : store.history[k] || 0,
      isToday: k === todayKey(),
    }
  })

  // Heatmap
  const today = todayKey()

  return (
    <div className="p-4 space-y-3 pb-20">
      {/* Top Stats */}
      <div className="flex gap-3">
        <Card className="flex-1">
          <CardContent className="p-4 flex flex-col items-center">
            <ProgressRing progress={op} size={100} strokeWidth={6} color={oColor} label={`${op}%`} sublabel="OVERALL" />
            <div className="font-mono text-[10px] text-muted-foreground mt-2">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 flex flex-col gap-2">
          <Card className="flex-1">
            <CardContent className="p-3 text-center flex flex-col justify-center h-full">
              <div className="text-4xl font-bold text-orange-500 leading-none">{store.meta.streak}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">STREAK</div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-3 text-center flex flex-col justify-center h-full">
              <div className="text-4xl font-bold text-primary leading-none">{todayData.mcqs}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">MCQs TODAY</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Breakdown */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-4">Today&apos;s Breakdown</span>
          {[
            { l: "Study Blocks", d: bd, t: bt, c: colorMap.lime },
            { l: "MCQs Solved", d: todayData.mcqs, t: mt, c: "#4ade80" },
            { l: "Meals Logged", d: store.getMealsDone(), t: 4, c: colorMap.amber },
            { l: "Fitness Goals", d: fd, t: ft, c: colorMap.orange },
            { l: "Calories", d: kcalDone, t: TOTAL_KCAL, c: colorMap.violet, u: " kcal" },
            { l: "Protein", d: Math.round(proDone), t: Math.round(TOTAL_PRO), c: colorMap.cyan, u: "g" },
          ].map((s) => (
            <div key={s.l} className="mb-3 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-foreground">{s.l}</span>
                <span className="font-mono text-[10px] font-bold" style={{ color: s.c }}>
                  {s.d}{s.u || ""} / {s.t}{s.u || ""}
                </span>
              </div>
              <ProgressBar value={s.d} max={s.t} color={s.c} height={5} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MDCAT Progress by Subject */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-4">MDCAT Progress by Subject</span>
          {Object.entries(subjStats).map(([s, v]) => {
            const p = Math.round((v.done / v.total) * 100)
            const color = colorMap[SUBJ_COLOR[s]] || colorMap.lime
            return (
              <div key={s} className="mb-3 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color }}>{sNames[s] || s}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{v.done}/{v.total} {p}%</span>
                </div>
                <ProgressBar value={v.done} max={v.total} color={color} height={5} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 7-Day Completion */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-4">7-Day Completion</span>
          <div className="flex gap-1 items-end h-[100px] pt-5">
            {weekData.map((d, i) => {
              const bc = d.pct >= 80 ? "#22c55e" : d.pct >= 50 ? "#eab308" : d.pct > 0 ? "#ef4444" : "oklch(0.15 0.02 280)"
              const bh = Math.max(4, (d.pct / 100) * 72)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px]" style={{ color: d.pct > 0 ? bc : "transparent" }}>{d.pct}%</span>
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: bh,
                      background: d.isToday ? bc : `${bc}88`,
                      boxShadow: d.isToday && d.pct > 0 ? `0 0 10px ${bc}55` : "none",
                    }}
                  />
                  <span className={cn("font-mono text-[10px]", d.isToday ? "text-foreground font-bold" : "text-muted-foreground")}>
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 24-Day Heatmap */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-4">24-Day Heatmap</span>
          <div className="grid grid-cols-8 gap-1">
            {PLAN.map((d) => {
              const dp = store.mdcatDayPct(d)
              const isToday = d.date === today
              const isDone = dp === 100
              const isPartial = dp > 0 && dp < 100
              return (
                <button
                  key={d.day}
                  onClick={() => store.setView("plan")}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center border transition-all",
                    isDone && "bg-primary/15 border-primary/40",
                    isPartial && "bg-amber-500/10 border-amber-500/30",
                    isToday && !isDone && !isPartial && "border-destructive",
                    !isDone && !isPartial && !isToday && "border-border"
                  )}
                  style={isToday ? { boxShadow: "0 0 8px rgba(239,68,68,0.25)" } : {}}
                >
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{
                      color: isDone ? colorMap.lime : isPartial ? colorMap.amber : isToday ? colorMap.coral : "var(--muted-foreground)",
                    }}
                  >
                    {d.day}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3 flex-wrap">
            {[
              [colorMap.lime, "Done"],
              [colorMap.amber, "Partial"],
              [colorMap.coral, "Today"],
              ["var(--muted-foreground)", "Pending"],
            ].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded" style={{ background: c }} />
                <span className="font-mono text-[10px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
