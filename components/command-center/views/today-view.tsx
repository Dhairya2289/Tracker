"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { MEALS, NEET_BLOCKS, MDCAT_BLOCKS, MDCAT_BLOCK_INFO, SUBJ_COLOR, SUBJ_LBL } from "@/lib/data"
import { ProgressRing } from "../progress-ring"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronDown, ChevronUp, Leaf, Calculator, FlaskConical, Atom, Zap, RefreshCw, Sunrise, Sun, Sunset, Moon, Timer, Play, Pause, RotateCcw, StickyNote } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.68 0.14 155)",
  coral: "oklch(0.65 0.16 25)",
  cyan: "oklch(0.72 0.10 200)",
  amber: "oklch(0.72 0.12 85)",
  violet: "oklch(0.68 0.12 280)",
  orange: "oklch(0.70 0.12 55)",
  slate: "oklch(0.55 0.02 260)",
}

const mealIcons = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
}

const blockIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
    <div className="px-4 py-5 space-y-5 pb-24">
      {/* Ticker - simplified */}
      <div className="overflow-hidden rounded-xl border border-destructive/15 bg-destructive/5 px-4 py-2.5">
        <div className="animate-marquee whitespace-nowrap font-mono text-[11px] text-destructive/80 tracking-wide">
          EXECUTE. 14 hours. No mercy. No backlog. GENETICS + ECOLOGY = RANK DECIDER. Phone is OFF. Brain is ON. MCQs + Mistakes = Mastery. VERY WINNABLE. MOVE.
        </div>
      </div>

      {/* Current Block HUD */}
      {currentBlock ? (
        <Card className="overflow-hidden border-primary/20 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Current Block</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-[10px] text-primary">LIVE</span>
              </div>
            </div>
            <div className="font-mono text-xs text-muted-foreground tracking-wide">
              Block {currentBlock.block.n} - {currentBlock.block.dur}
            </div>
            <div className="text-lg font-semibold text-foreground mt-1 mb-4 leading-tight">
              {currentBlock.block.task}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{currentBlock.block.time}</span>
              <div className="flex-1">
                <ProgressBar value={currentBlock.pct} max={100} color={colorMap.amber} height={3} />
              </div>
              <span className="font-mono text-xs text-destructive min-w-[52px] text-right font-medium">{currentBlock.remaining}m left</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
              <Moon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Outside scheduled blocks</div>
              <div className="font-mono text-[11px] text-muted-foreground mt-0.5">Schedule: 06:00 - 21:30</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Block Timeline */}
      <div className="flex gap-1.5">
        {MDCAT_BLOCKS.map((_, i) => {
          const st = mounted ? getBlockStatus(i) : "future"
          return (
            <div
              key={i}
              className={cn(
                "flex-1 h-8 rounded-lg flex items-center justify-center transition-all",
                st === "done" && "bg-primary/10 border border-primary/20",
                st === "active" && "bg-amber-500/10 border border-amber-500/40",
                st === "future" && "bg-muted/20 border border-border/40"
              )}
            >
              <span className={cn(
                "font-mono text-[10px] font-medium",
                st === "done" && "text-primary",
                st === "active" && "text-amber-500",
                st === "future" && "text-muted-foreground/60"
              )}>
                {st === "done" ? "✓" : `B${i + 1}`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress Rings */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-around items-center">
            <ProgressRing progress={op} size={100} strokeWidth={5} color={oColor} label={`${op}%`} sublabel="Overall" />
            <div className="flex flex-col gap-4">
              {[
                { pct: sp, label: "Study", color: colorMap.lime },
                { pct: dp, label: "Diet", color: colorMap.amber },
                { pct: fp, label: "Fitness", color: colorMap.orange },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <ProgressRing progress={item.pct} size={44} strokeWidth={3} color={item.color} label={`${item.pct}%`} />
                  <div>
                    <div className="font-mono text-[10px] text-muted-foreground/70 tracking-wider uppercase">{item.label}</div>
                    <div className="text-sm font-semibold" style={{ color: item.color }}>{item.pct}%</div>
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
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-3">Today&apos;s Mode</span>
          <div className="flex gap-2">
            {[
              { id: "bad", label: "Tough", color: colorMap.coral, blocks: 4, mcq: 40 },
              { id: "normal", label: "Normal", color: colorMap.cyan, blocks: 6, mcq: 80 },
              { id: "peak", label: "Peak", color: colorMap.lime, blocks: 7, mcq: 120 },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => store.setMode(mode.id as "bad" | "normal" | "peak")}
                className={cn(
                  "flex-1 py-3 px-2 rounded-xl border text-center transition-all active:scale-[0.98]",
                  todayData.dayType === mode.id
                    ? "border-current bg-current/5"
                    : "border-border/60 text-muted-foreground"
                )}
                style={{ color: todayData.dayType === mode.id ? mode.color : undefined }}
              >
                <div className="font-semibold text-sm">{mode.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5 font-mono">{mode.blocks} blk / {mode.mcq} MCQ</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Focus Input */}
      <Card className={cn("border-l-[3px]", todayData.focus ? "border-l-primary" : "border-l-transparent")}>
        <CardContent className="p-4">
          <span className={cn("font-mono text-[10px] tracking-widest uppercase block mb-3", todayData.focus ? "text-primary" : "text-muted-foreground/70")}>
            Focus Topic
          </span>
          <Input
            placeholder="e.g. Genetics Ch.5, Electrochemistry"
            value={todayData.focus}
            onChange={(e) => store.setFocus(e.target.value)}
            className="bg-muted/20 border-border/60 font-mono text-sm h-11"
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
              <span className="font-mono text-xs font-semibold" style={{ color: store.mdcatDayDone(todayPlan) ? colorMap.lime : colorMap.amber }}>
                {todayPlan.tasks.filter((t) => store.mdcatDone[t.id]).length}/{todayPlan.tasks.length}
              </span>
            </div>
            <ProgressBar
              value={todayPlan.tasks.filter((t) => store.mdcatDone[t.id]).length}
              max={todayPlan.tasks.length}
              color={colorMap.lime}
              height={4}
            />
            <div className="mt-4 space-y-2">
              {todayPlan.tasks.map((task) => {
                const done = store.mdcatDone[task.id]
                const color = colorMap[SUBJ_COLOR[task.subj]] || colorMap.lime
                return (
                  <button
                    key={task.id}
                    onClick={() => store.toggleMdcatTask(task.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left active:scale-[0.99]",
                      done ? "bg-primary/5 border-primary/15" : "border-border/60 hover:border-border"
                    )}
                    style={{ borderLeftWidth: 3, borderLeftColor: color }}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                      done ? "bg-primary border-primary" : "border-border/80 bg-background"
                    )}>
                      {done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <span className={cn("flex-1 text-sm font-medium leading-snug", done && "text-muted-foreground line-through")}>{task.text}</span>
                    <span
                      className="font-mono text-[9px] font-semibold px-2 py-1 rounded-md"
                      style={{ background: `${color}15`, color }}
                    >
                      {SUBJ_LBL[task.subj]}
                    </span>
                  </button>
                )
              })}
            </div>
            {store.mdcatDayDone(todayPlan) && (
              <div className="mt-4 p-3.5 rounded-xl bg-primary/10 border border-primary/15 text-center">
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
            <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">Study Blocks</span>
            <span className="font-mono text-xs font-semibold" style={{ color: bd >= bt ? colorMap.lime : "var(--muted-foreground)" }}>
              {bd} / {bt} done
            </span>
          </div>
          <ProgressBar value={bd} max={bt} color={colorMap.lime} height={4} />
          <div className="mt-4 space-y-2">
            {NEET_BLOCKS.map((block) => {
              const done = todayData.blocks[block.id]
              const color = colorMap[block.color]
              const Icon = blockIcons[block.icon] || Zap
              const isExpanded = expandedBlocks.has(block.id)
              return (
                <div key={block.id} className="rounded-xl border border-border/60 overflow-hidden" style={{ borderColor: done ? `${color}30` : undefined }}>
                  <button
                    onClick={() => store.toggleNeetBlock(block.id)}
                    className="w-full flex items-center gap-3 p-3.5 text-left active:opacity-80"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                      done ? "border-current" : "border-border/80 bg-background"
                    )} style={done ? { background: color, borderColor: color } : {}}>
                      {done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: done ? color : "var(--muted-foreground)" }} />
                        <span className={cn("text-sm font-semibold")} style={done ? { color } : {}}>
                          {block.subj}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{block.tag}{block.mcqT > 0 && ` / ${block.mcqT} MCQs`}</div>
                    </div>
                    {block.critical && (
                      <span className="font-mono text-[9px] px-2 py-1 rounded-md border" style={{ background: `${color}10`, color, borderColor: `${color}30` }}>
                        CRIT
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => toggleBlockExpand(block.id)}
                    className="w-full px-4 py-2 bg-muted/10 border-t border-border/40 text-left font-mono text-[10px] text-muted-foreground/70 tracking-wider flex items-center gap-1.5 hover:text-muted-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? "Hide Rule" : "Show Rule"}
                  </button>
                  {isExpanded && (
                    <div className="px-4 py-3.5 bg-muted/10 border-t border-border/40">
                      <div className="font-mono text-xs font-semibold mb-1" style={{ color }}>{block.rule}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{block.tip}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {bd === 7 && (
            <div className="mt-4 p-3.5 rounded-xl bg-primary/10 border border-primary/15 text-center">
              <span className="text-primary font-semibold text-sm">ALL BLOCKS COMPLETE - LEGENDARY DAY!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MCQ Counter */}
      <Card className={todayData.mcqs >= mt ? "border-primary/20" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">MCQs Today</span>
            <span className="font-mono text-xs font-semibold" style={{ color: todayData.mcqs >= mt ? colorMap.lime : colorMap.amber }}>
              {todayData.mcqs} / {mt}
            </span>
          </div>
          <ProgressBar value={todayData.mcqs} max={mt} color={colorMap.lime} height={5} />
          <div className="flex gap-2 mt-4">
            {[10, 25, 50].map((n) => (
              <Button key={n} variant="outline" size="sm" onClick={() => store.addMcqs(n)} className="flex-1 font-mono text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 h-10">
                +{n}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => store.addMcqs(-10)} className="flex-1 font-mono text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10 h-10">
              -10
            </Button>
          </div>
          <McqExactInput currentValue={todayData.mcqs} onSet={store.setMcqs} />
        </CardContent>
      </Card>

      {/* Pomodoro Timer */}
      <PomodoroTimer onComplete={() => store.addPomodoro()} sessions={todayData.pomodoroSessions ?? 0} />

      {/* Meals Quick */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">Meals</span>
            <span className="font-mono text-xs font-semibold text-amber-500">
              {kcalDone} / {MEALS.reduce((s, m) => s + m.kcal, 0)} kcal
            </span>
          </div>
          <ProgressBar value={kcalDone} max={MEALS.reduce((s, m) => s + m.kcal, 0)} color={colorMap.amber} height={4} />
          <div className="mt-4 space-y-2">
            {MEALS.map((meal) => {
              const done = todayData.meals[meal.id]
              const color = colorMap[meal.color]
              const Icon = mealIcons[meal.icon as keyof typeof mealIcons] || Sun
              return (
                <button
                  key={meal.id}
                  onClick={() => store.toggleMeal(meal.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left active:scale-[0.99]",
                    done ? "border-current bg-current/5" : "border-border/60"
                  )}
                  style={done ? { borderColor: `${color}40` } : {}}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
                    done ? "border-current bg-current" : "border-border/80 bg-background"
                  )} style={done ? { backgroundColor: color, borderColor: color } : {}}>
                    {done && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <Icon className="w-5 h-5" style={{ color: done ? color : "var(--muted-foreground)" }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={done ? { color } : {}}>{meal.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/70">{meal.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color }}>{meal.kcal}</div>
                    <div className="font-mono text-[9px] text-muted-foreground/60">kcal</div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Note */}
      <Card className={cn("border-l-[3px]", todayData.note ? "border-l-violet-500" : "border-l-transparent")}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-4 h-4" style={{ color: todayData.note ? colorMap.violet : "var(--muted-foreground)" }} />
            <span className={cn("font-mono text-[10px] tracking-widest uppercase", todayData.note ? "text-violet-500" : "text-muted-foreground/70")}>
              Daily Note
            </span>
          </div>
          <textarea
            placeholder="Thoughts, reflections, or notes for today..."
            value={todayData.note ?? ""}
            onChange={(e) => store.setNote(e.target.value)}
            className="w-full min-h-[100px] bg-muted/20 border border-border/60 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all placeholder:text-muted-foreground/50"
          />
          {todayData.note && (
            <div className="mt-2 font-mono text-[10px] text-muted-foreground/50 text-right">
              {todayData.note.length} chars / auto-saved
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

function PomodoroTimer({ onComplete, sessions }: { onComplete: () => void; sessions: number }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    if (timeLeft <= 0) {
      setIsRunning(false)
      if (!isBreak) {
        onComplete()
        setIsBreak(true)
        setTimeLeft(5 * 60)
      } else {
        setIsBreak(false)
        setTimeLeft(25 * 60)
      }
      return
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isBreak, onComplete])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const progress = isBreak ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 : ((25 * 60 - timeLeft) / (25 * 60)) * 100
  const color = isBreak ? colorMap.cyan : colorMap.coral

  const reset = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  return (
    <Card className="border-l-[3px]" style={{ borderLeftColor: color }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" style={{ color }} />
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color }}>
              {isBreak ? "Break Time" : "Focus Session"}
            </span>
          </div>
          <span className="font-mono text-xs font-semibold" style={{ color: sessions > 0 ? colorMap.lime : "var(--muted-foreground)" }}>
            {sessions} done
          </span>
        </div>

        <div className="text-center mb-4">
          <div
            className="font-mono text-5xl font-bold tracking-wider"
            style={{ color: isRunning ? color : "var(--foreground)" }}
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div className="font-mono text-[10px] text-muted-foreground/60 mt-2">
            {isBreak ? "5 min break" : "25 min focus"}
          </div>
        </div>

        <ProgressBar value={progress} max={100} color={color} height={4} />

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "flex-1 h-11 font-mono text-sm gap-2 transition-all",
              isRunning
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/15"
                : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
            )}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="h-11 px-4 font-mono text-xs border-border/60 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function McqExactInput({ currentValue, onSet }: { currentValue: number; onSet: (n: number) => void }) {
  const [inputValue, setInputValue] = useState(currentValue > 0 ? String(currentValue) : "")
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    const v = parseInt(inputValue)
    if (!isNaN(v) && v >= 0) {
      onSet(v)
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 1500)
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <div className="relative flex-1">
        <Input
          type="number"
          placeholder="Set exact number"
          min={0}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className={cn(
            "font-mono bg-muted/20 h-10 pr-16 transition-all",
            showConfirm && "border-primary/40 bg-primary/5"
          )}
        />
        {showConfirm && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-primary font-semibold">
            Set!
          </span>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSubmit}
        className="font-mono text-xs h-10 px-4 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
      >
        Set
      </Button>
      {currentValue > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            onSet(0)
            setInputValue("")
          }} 
          className="font-mono text-xs text-muted-foreground h-10"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
