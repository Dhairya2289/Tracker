"use client"

import { useStore } from "@/lib/store"
import { PLAN, SUBJ_COLOR, TOTAL_KCAL, TOTAL_PRO } from "@/lib/data"
import { ProgressRing } from "../progress-ring"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="px-4 py-5 space-y-4 pb-24">
      {/* Top Stats */}
      <div className="flex gap-3">
        <Card className="flex-1">
          <CardContent className="p-4 flex flex-col items-center">
            <ProgressRing progress={op} size={96} strokeWidth={5} color={oColor} label={`${op}%`} sublabel="Overall" />
            <div className="font-mono text-[10px] text-muted-foreground/70 mt-3">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 flex flex-col gap-2">
          <Card className="flex-1">
            <CardContent className="p-3 text-center flex flex-col justify-center h-full">
              <div className="text-3xl font-bold text-orange-500 leading-none tracking-tight">{store.meta.streak}</div>
              <div className="font-mono text-[9px] text-muted-foreground/70 mt-1.5 uppercase">Streak</div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="p-3 text-center flex flex-col justify-center h-full">
              <div className="text-3xl font-bold text-primary leading-none tracking-tight">{todayData.mcqs}</div>
              <div className="font-mono text-[9px] text-muted-foreground/70 mt-1.5 uppercase">MCQs Today</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Breakdown */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">Today&apos;s Breakdown</span>
          {[
            { l: "Study Blocks", d: bd, t: bt, c: colorMap.lime },
            { l: "MCQs Solved", d: todayData.mcqs, t: mt, c: colorMap.lime },
            { l: "Meals Logged", d: store.getMealsDone(), t: 4, c: colorMap.amber },
            { l: "Fitness Goals", d: fd, t: ft, c: colorMap.orange },
            { l: "Calories", d: kcalDone, t: TOTAL_KCAL, c: colorMap.violet, u: " kcal" },
            { l: "Protein", d: Math.round(proDone), t: Math.round(TOTAL_PRO), c: colorMap.cyan, u: "g" },
          ].map((s) => (
            <div key={s.l} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1.5">
                <span className="text-sm text-foreground">{s.l}</span>
                <span className="font-mono text-[10px] font-semibold" style={{ color: s.c }}>
                  {s.d}{s.u || ""} / {s.t}{s.u || ""}
                </span>
              </div>
              <ProgressBar value={s.d} max={s.t} color={s.c} height={4} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MDCAT Progress by Subject */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">MDCAT Progress by Subject</span>
          {Object.entries(subjStats).map(([s, v]) => {
            const p = Math.round((v.done / v.total) * 100)
            const color = colorMap[SUBJ_COLOR[s]] || colorMap.lime
            return (
              <div key={s} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color }}>{sNames[s] || s}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/70">{v.done}/{v.total} ({p}%)</span>
                </div>
                <ProgressBar value={v.done} max={v.total} color={color} height={4} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 7-Day Completion */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">7-Day Completion</span>
          <div className="flex gap-1.5 items-end h-[100px] pt-5">
            {weekData.map((d, i) => {
              const bc = d.pct >= 80 ? colorMap.lime : d.pct >= 50 ? colorMap.amber : d.pct > 0 ? colorMap.coral : "oklch(0.18 0.005 260)"
              const bh = Math.max(4, (d.pct / 100) * 72)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="font-mono text-[9px]" style={{ color: d.pct > 0 ? bc : "transparent" }}>{d.pct}%</span>
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: bh,
                      background: d.isToday ? bc : `${bc}70`,
                    }}
                  />
                  <span className={cn("font-mono text-[10px]", d.isToday ? "text-foreground font-semibold" : "text-muted-foreground/70")}>
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
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">24-Day Heatmap</span>
          <div className="grid grid-cols-8 gap-1.5">
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
                    "aspect-square rounded-lg flex items-center justify-center border transition-all active:scale-95",
                    isDone && "bg-primary/10 border-primary/30",
                    isPartial && "bg-amber-500/10 border-amber-500/25",
                    isToday && !isDone && !isPartial && "border-destructive/50",
                    !isDone && !isPartial && !isToday && "border-border/40"
                  )}
                >
                  <span
                    className="font-mono text-[10px] font-semibold"
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
          <div className="flex gap-4 mt-4 flex-wrap">
            {[
              [colorMap.lime, "Done"],
              [colorMap.amber, "Partial"],
              [colorMap.coral, "Today"],
              ["var(--muted-foreground)", "Pending"],
            ].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded" style={{ background: c }} />
                <span className="font-mono text-[9px] text-muted-foreground/70">{l}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
