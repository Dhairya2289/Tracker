"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { MEALS, NEET_BLOCKS, MDCAT_BLOCKS, MDCAT_BLOCK_INFO, SUBJ_COLOR, SUBJ_LBL, STEP_MS, CARDIO_MS } from "@/lib/data"
import { ProgressRing } from "../progress-ring"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronDown, ChevronUp, Leaf, Calculator, FlaskConical, Atom, Zap, RefreshCw, Target, Sunrise, Sun, Sunset, Moon, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.75 0.18 145)",
  coral: "oklch(0.70 0.20 25)",
  cyan: "oklch(0.78 0.12 200)",
  amber: "oklch(0.78 0.15 85)",
  violet: "oklch(0.72 0.15 290)",
  orange: "oklch(0.75 0.15 55)",
  slate: "oklch(0.55 0.02 280)",
}

const mealIcons = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
}

const blockIcons: Record<string, any> = {
  leaf: Leaf,
  check: Check,
  calculator: Calculator,
  flask: FlaskConical,
  atom: Atom,
  zap: Zap,
  refresh: RefreshCw,
}

function getCurrentMdcatBlock() {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  for (let i = 0; i < MDCAT_BLOCKS.length; i++) {
    const b = MDCAT_BLOCKS[i]
    const s = b.start[0] * 60 + b.start[1]
    const e = b.end[0] * 60 + b.end[1]
    if (mins >= s && mins < e) {
      return { idx: i, pct: Math.round(((mins - s) / (e - s)) * 100), remaining: e - mins, block: MDCAT_BLOCK_INFO[i] }
    }
  }
  return null
}

function getBlockStatus(i: number) {
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const b = MDCAT_BLOCKS[i]
  const s = b.start[0] * 60 + b.start[1]
  const e = b.end[0] * 60 + b.end[1]
  return mins >= e ? "done" : mins >= s ? "active" : "future"
}

export function TodayView() {
  const store = useStore()
  const [currentBlock, setCurrentBlock] = useState<ReturnType<typeof getCurrentMdcatBlock>>(null)
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set())

  useEffect(() => {
    const update = () => setCurrentBlock(getCurrentMdcatBlock())
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [])

  const todayData = store.getTodayData()
  const todayPlan = store.mdcatTodayPlan()
  const { blocks: bt, mcq: mt } = store.getDayTargets()
  const bd = store.getBlocksDone()
  const op = store.getOverallPct()
  const sp = store.getStudyPct()
  const dp = store.getDietPct()
  const fp = store.getFitPct()
  const oColor = op >= 80 ? colorMap.lime : op >= 50 ? colorMap.amber : colorMap.coral
  const cp = store.getCurrentPhase()
  const { stepsHit, cardioHit } = store.getFitDone()
  const kcalDone = store.getKcalDone()

  const toggleBlockExpand = (id: number) => {
    setExpandedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Ticker */}
      <div className="overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
        <div className="animate-marquee whitespace-nowrap font-mono text-[10px] text-destructive tracking-wider">
          EXECUTE. 14 hours. No mercy. No backlog. GENETICS + ECOLOGY = RANK DECIDER. Phone is OFF. Brain is ON. MCQs + Mistakes = Mastery. VERY WINNABLE. MOVE.
        </div>
      </div>

      {/* Current Block HUD */}
      {currentBlock ? (
        <Card className="relative overflow-hidden border-primary/30">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-destructive via-amber-500 to-primary animate-pulse" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">CURRENT BLOCK</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 10px oklch(0.75 0.18 145)" }} />
            </div>
            <div className="font-mono text-xs text-muted-foreground tracking-wider">
              BLOCK {currentBlock.block.n} {currentBlock.block.dur}
            </div>
            <div className="text-xl font-bold text-foreground mt-1 mb-3">
              {currentBlock.block.task}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-amber-500">{currentBlock.block.time}</span>
              <div className="flex-1">
                <ProgressBar value={currentBlock.pct} max={100} color={colorMap.amber} height={4} />
              </div>
              <span className="font-mono text-xs text-destructive min-w-[48px] text-right">{currentBlock.remaining}m left</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-lg opacity-50">{"⏸"}</div>
            <div>
              <div className="text-sm text-muted-foreground">Outside scheduled blocks</div>
              <div className="font-mono text-[10px] text-muted-foreground/50">Schedule: 06:00 - 21:30</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Block Timeline */}
      <div className="flex gap-1">
        {MDCAT_BLOCKS.map((_, i) => {
          const st = getBlockStatus(i)
          return (
            <div
              key={i}
              className={cn(
                "flex-1 h-7 rounded flex items-center justify-center border transition-all",
                st === "done" && "bg-primary/10 border-primary/30",
                st === "active" && "bg-amber-500/10 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
                st === "future" && "bg-muted/30 border-border"
              )}
            >
              <span className={cn(
                "font-mono text-[10px] font-semibold",
                st === "done" && "text-primary",
                st === "active" && "text-amber-500",
                st === "future" && "text-muted-foreground"
              )}>
                {st === "done" ? "✓" : `B${i + 1}`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rings Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-around items-center">
            <ProgressRing progress={op} size={106} strokeWidth={6} color={oColor} label={`${op}%`} sublabel="OVERALL" />
            <div className="flex flex-col gap-4">
              {[
                { pct: sp, label: "STUDY", color: colorMap.lime },
                { pct: dp, label: "DIET", color: colorMap.amber },
                { pct: fp, label: "FITNESS", color: colorMap.orange },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <ProgressRing progress={item.pct} size={50} strokeWidth={4} color={item.color} label={`${item.pct}%`} />
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-wider">{item.label}</div>
                    <div className="text-sm font-bold" style={{ color: item.color }}>{item.pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Mode */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-3">Today&apos;s Mode</span>
          <div className="flex gap-2">
            {[
              { id: "bad", label: "Tough", color: colorMap.coral, blocks: 4, mcq: 40 },
              { id: "normal", label: "Normal", color: colorMap.cyan, blocks: 6, mcq: 80 },
              { id: "peak", label: "Peak", color: colorMap.lime, blocks: 7, mcq: 120 },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => store.setMode(mode.id as any)}
                className={cn(
                  "flex-1 py-2.5 px-2 rounded-lg border text-center transition-all font-mono text-[11px]",
                  todayData.dayType === mode.id
                    ? "border-current bg-white/5"
                    : "border-border text-muted-foreground"
                )}
                style={{ color: todayData.dayType === mode.id ? mode.color : undefined }}
              >
                <div className="font-semibold">{mode.label}</div>
                <div className="text-[9px] opacity-60 mt-0.5">{mode.blocks} blk {mode.mcq} MCQ</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Focus Input */}
      <Card className={cn("border-l-[3px]", todayData.focus ? "border-l-primary" : "border-l-border")}>
        <CardContent className="p-4">
          <span className={cn("font-mono text-[10px] tracking-widest uppercase block mb-3", todayData.focus ? "text-primary" : "text-muted-foreground")}>
            Focus Topic
          </span>
          <Input
            placeholder="e.g. Genetics Ch.5, Electrochemistry"
            value={todayData.focus}
            onChange={(e) => store.setFocus(e.target.value)}
            className="bg-muted/30 border-border font-mono"
          />
        </CardContent>
      </Card>

      {/* MDCAT Tasks */}
      {todayPlan && (
        <Card className="border-l-[3px] border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] text-destructive tracking-widest uppercase">
                Day {todayPlan.day}: {todayPlan.section}
              </span>
              <span className="font-mono text-xs font-bold" style={{ color: store.mdcatDayDone(todayPlan) ? colorMap.lime : colorMap.amber }}>
                {todayPlan.tasks.filter((t) => store.mdcatDone[t.id]).length}/{todayPlan.tasks.length}
              </span>
            </div>
            <ProgressBar
              value={todayPlan.tasks.filter((t) => store.mdcatDone[t.id]).length}
              max={todayPlan.tasks.length}
              color={colorMap.lime}
              height={5}
            />
            <div className="mt-3 space-y-1">
              {todayPlan.tasks.map((task) => {
                const done = store.mdcatDone[task.id]
                const color = colorMap[SUBJ_COLOR[task.subj]] || colorMap.lime
                return (
                  <button
                    key={task.id}
                    onClick={() => store.toggleMdcatTask(task.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                      done ? "bg-primary/5 border-primary/20" : "border-border hover:border-border/80"
                    )}
                    style={{ borderLeftWidth: 3, borderLeftColor: color }}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                      done ? "bg-primary border-primary" : "border-border bg-background"
                    )}>
                      {done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={cn("flex-1 text-sm font-medium", done && "text-muted-foreground line-through")}>{task.text}</span>
                    <span
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${color}20`, color }}
                    >
                      {SUBJ_LBL[task.subj]}
                    </span>
                  </button>
                )
              })}
            </div>
            {store.mdcatDayDone(todayPlan) && (
              <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <span className="text-primary font-semibold text-sm">All tasks done - Day {todayPlan.day} complete!</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Study Blocks */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Study Blocks</span>
            <span className="font-mono text-xs font-bold" style={{ color: bd >= bt ? colorMap.lime : "var(--muted-foreground)" }}>
              {bd} / {bt} done
            </span>
          </div>
          <ProgressBar value={bd} max={bt} color={colorMap.lime} height={5} />
          <div className="mt-3 space-y-1">
            {NEET_BLOCKS.map((block) => {
              const done = todayData.blocks[block.id]
              const color = colorMap[block.color]
              const Icon = blockIcons[block.icon] || Zap
              const isExpanded = expandedBlocks.has(block.id)
              return (
                <div key={block.id} className="rounded-lg border border-border overflow-hidden" style={{ borderColor: done ? `${color}50` : undefined }}>
                  <button
                    onClick={() => store.toggleNeetBlock(block.id)}
                    className="w-full flex items-center gap-2 p-3 text-left"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                      done ? "border-current" : "border-border bg-background"
                    )} style={done ? { background: color, borderColor: color } : {}}>
                      {done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: done ? color : "var(--muted-foreground)" }} />
                        <span className={cn("text-sm font-semibold", done && "text-primary")} style={done ? { color } : {}}>
                          {block.subj}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">{block.tag}{block.mcqT > 0 && ` ${block.mcqT} MCQs`}</div>
                    </div>
                    {block.critical && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ background: `${color}20`, color, borderColor: `${color}40` }}>
                        CRIT
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => toggleBlockExpand(block.id)}
                    className="w-full px-3 py-1.5 bg-muted/30 border-t border-border/50 text-left font-mono text-[10px] text-muted-foreground tracking-wider flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? "HIDE RULE" : "SHOW RULE"}
                  </button>
                  {isExpanded && (
                    <div className="px-3 py-3 bg-muted/20 border-t border-border/50">
                      <div className="font-mono text-xs font-bold mb-1" style={{ color }}>{block.rule}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{block.tip}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {bd === 7 && (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <span className="text-primary font-semibold text-sm">ALL BLOCKS COMPLETE - LEGENDARY DAY!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MCQ Counter */}
      <Card className={todayData.mcqs >= mt ? "border-primary/30" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">MCQs Today</span>
            <span className="font-mono text-xs font-bold" style={{ color: todayData.mcqs >= mt ? colorMap.lime : colorMap.amber }}>
              {todayData.mcqs} / {mt}
            </span>
          </div>
          <ProgressBar value={todayData.mcqs} max={mt} color={colorMap.lime} height={6} />
          <div className="flex gap-2 mt-3">
            {[10, 25, 50].map((n) => (
              <Button key={n} variant="outline" size="sm" onClick={() => store.addMcqs(n)} className="flex-1 font-mono text-primary border-primary/30 bg-primary/10 hover:bg-primary/20">
                +{n}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => store.addMcqs(-10)} className="flex-1 font-mono text-destructive border-destructive/30 bg-destructive/10 hover:bg-destructive/20">
              -10
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              type="number"
              placeholder="Set exact number"
              min={0}
              className="flex-1 font-mono bg-muted/30"
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (!isNaN(v) && v >= 0) store.setMcqs(v)
              }}
            />
            {todayData.mcqs > 0 && (
              <Button variant="ghost" size="sm" onClick={() => store.setMcqs(0)} className="font-mono text-xs text-muted-foreground">
                reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meals Quick */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Meals</span>
            <span className="font-mono text-xs font-bold text-amber-500">
              {kcalDone} / {MEALS.reduce((s, m) => s + m.kcal, 0)} kcal
            </span>
          </div>
          <ProgressBar value={kcalDone} max={MEALS.reduce((s, m) => s + m.kcal, 0)} color={colorMap.amber} height={5} />
          <div className="mt-3 space-y-1">
            {MEALS.map((meal) => {
              const done = todayData.meals[meal.id]
              const color = colorMap[meal.color]
              const Icon = mealIcons[meal.icon as keyof typeof mealIcons] || Sun
              return (
                <button
                  key={meal.id}
                  onClick={() => store.toggleMeal(meal.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                    done ? "border-current bg-current/5" : "border-border"
                  )}
                  style={done ? { borderColor: color } : {}}
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                    done ? "border-current bg-current" : "border-border bg-background"
                  )} style={done ? { backgroundColor: color, borderColor: color } : {}}>
                    {done && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <Icon className="w-4 h-4" style={{ color: done ? color : "var(--muted-foreground)" }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={done ? { color } : {}}>{meal.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{meal.time} {meal.kcal} kcal {meal.pro}g pro</div>
                  </div>
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}20`, color }}>
                    {meal.kcal}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fitness Quick */}
      <Card className="border-l-[3px]" style={{ borderLeftColor: colorMap[cp.color] || colorMap.lime }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: colorMap[cp.color] }}>
              Fitness {cp.name}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={cn("rounded-lg border p-3 text-center", stepsHit && "border-orange-500/50")}>
              <div className="text-xl font-bold" style={{ color: stepsHit ? colorMap.orange : "var(--muted-foreground)" }}>
                {todayData.steps > 0 ? (todayData.steps >= 1000 ? `${(todayData.steps / 1000).toFixed(1)}k` : todayData.steps) : "-"}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">STEPS{stepsHit && " ✓"}</div>
            </div>
            {cp.cardio > 0 && (
              <div className={cn("rounded-lg border p-3 text-center", cardioHit && "border-cyan-500/50")}>
                <div className="text-xl font-bold" style={{ color: cardioHit ? colorMap.cyan : "var(--muted-foreground)" }}>
                  {todayData.cardio > 0 ? `${todayData.cardio}m` : "-"}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mt-1">CARDIO{cardioHit && " ✓"}</div>
              </div>
            )}
            <div className={cn("rounded-lg border p-3 text-center", todayData.strength && "border-violet-500/50")}>
              <div className="text-xl font-bold" style={{ color: todayData.strength ? colorMap.violet : "var(--muted-foreground)" }}>
                {todayData.strength ? "✓" : "-"}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">STRENGTH</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">STEPS TARGET: {cp.steps.toLocaleString()}</div>
            <div className="flex gap-1">
              {STEP_MS.map((m) => (
                <button
                  key={m}
                  onClick={() => store.setSteps(m)}
                  className={cn(
                    "flex-1 py-2 rounded-lg border font-mono text-[10px] font-semibold transition-all",
                    todayData.steps >= m ? "bg-orange-500/20 border-orange-500 text-orange-500" : "border-border text-muted-foreground"
                  )}
                >
                  {m >= 1000 ? `${m / 1000}k` : m}
                </button>
              ))}
            </div>
            {todayData.steps > 0 && <ProgressBar value={todayData.steps} max={cp.steps} color={colorMap.orange} height={4} className="mt-2" />}
          </div>

          {cp.cardio > 0 && (
            <div className="mb-4">
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">CARDIO TARGET: {cp.cardio} min</div>
              <div className="flex gap-1">
                {CARDIO_MS.map((m) => (
                  <button
                    key={m}
                    onClick={() => store.setCardio(m)}
                    className={cn(
                      "flex-1 py-2 rounded-lg border font-mono text-[10px] font-semibold transition-all",
                      todayData.cardio >= m ? "bg-cyan-500/20 border-cyan-500 text-cyan-500" : "border-border text-muted-foreground"
                    )}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => store.toggleStrength()}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
              todayData.strength ? "border-violet-500 bg-violet-500/5" : "border-border"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
              todayData.strength ? "bg-violet-500 border-violet-500" : "border-border bg-background"
            )}>
              {todayData.strength && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <Dumbbell className="w-4 h-4" style={{ color: todayData.strength ? colorMap.violet : "var(--muted-foreground)" }} />
            <div className="flex-1">
              <div className="text-sm font-medium" style={todayData.strength ? { color: colorMap.violet } : {}}>Strength Training</div>
              <div className="font-mono text-[10px] text-muted-foreground">5x/week Compound lifts Progressive overload</div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
