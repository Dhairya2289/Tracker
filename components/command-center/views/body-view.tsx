"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { FIT_PHASES, FIT_RULES, STEP_MS, CARDIO_MS } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Dumbbell, Footprints, Bike, Flame, Target, BookOpen, X } from "lucide-react"
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

const phaseIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  book: BookOpen,
  footprints: Footprints,
  bike: Bike,
  flame: Flame,
  target: Target,
  dumbbell: Dumbbell,
}

export function BodyView() {
  const store = useStore()
  const [weightInput, setWeightInput] = useState("")
  const todayData = store.getTodayData()
  const cp = store.getCurrentPhase()
  const { stepsHit, cardioHit, done: fd, total: ft } = store.getFitDone()

  const handleSaveWeight = () => {
    const w = parseFloat(weightInput)
    if (w && w >= 20 && w <= 400) {
      store.saveWeight(w)
      setWeightInput("")
    }
  }

  return (
    <div className="px-4 py-5 space-y-4 pb-24">
      {/* Overview */}
      <Card className="border-l-[3px]" style={{ borderLeftColor: colorMap[cp.color] }}>
        <CardContent className="p-5 text-center">
          <div className="font-mono text-[10px] text-muted-foreground/70 tracking-widest mb-3 uppercase">120 kg to 75 kg / 6 Phases</div>
          <div className="text-2xl font-bold text-foreground tracking-tight">Fat Loss Plan</div>
          <div className="flex gap-1.5 mt-5 justify-center">
            {FIT_PHASES.map((ph, i) => (
              <div
                key={ph.id}
                className={cn("h-1.5 flex-1 rounded-full max-w-[36px]", i <= store.meta.fitnessPhase ? "" : "bg-muted/20")}
                style={i <= store.meta.fitnessPhase ? { background: colorMap[ph.color] } : {}}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <Card className="border-l-[3px]" style={{ borderLeftColor: colorMap[cp.color] }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: colorMap[cp.color] }}>
              Today&apos;s Activity
            </span>
            <span className="font-mono text-xs font-semibold" style={{ color: fd === ft ? colorMap.lime : "var(--muted-foreground)" }}>
              {fd}/{ft} done
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className={cn("rounded-xl border p-3.5 text-center transition-all", stepsHit && "border-orange-500/30 bg-orange-500/5")}>
              <div className="text-lg font-semibold" style={{ color: stepsHit ? colorMap.orange : "var(--muted-foreground)" }}>
                {todayData.steps > 0 ? (todayData.steps >= 1000 ? `${(todayData.steps / 1000).toFixed(1)}k` : todayData.steps) : "-"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/70 mt-1 uppercase">Steps{stepsHit && " ✓"}</div>
            </div>
            {cp.cardio > 0 && (
              <div className={cn("rounded-xl border p-3.5 text-center transition-all", cardioHit && "border-cyan-500/30 bg-cyan-500/5")}>
                <div className="text-lg font-semibold" style={{ color: cardioHit ? colorMap.cyan : "var(--muted-foreground)" }}>
                  {todayData.cardio > 0 ? `${todayData.cardio}m` : "-"}
                </div>
                <div className="font-mono text-[9px] text-muted-foreground/70 mt-1 uppercase">Cardio{cardioHit && " ✓"}</div>
              </div>
            )}
            <div className={cn("rounded-xl border p-3.5 text-center transition-all", todayData.strength && "border-violet-500/30 bg-violet-500/5")}>
              <div className="text-lg font-semibold" style={{ color: todayData.strength ? colorMap.violet : "var(--muted-foreground)" }}>
                {todayData.strength ? "✓" : "-"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/70 mt-1 uppercase">Strength</div>
            </div>
          </div>

          <div className="mb-5">
            <div className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase mb-2.5">Steps Target: {cp.steps.toLocaleString()}</div>
            <div className="flex gap-1.5 mb-3">
              {STEP_MS.map((m) => (
                <button
                  key={m}
                  onClick={() => store.setSteps(m)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg border font-mono text-[10px] font-medium transition-all active:scale-[0.98]",
                    todayData.steps >= m ? "bg-orange-500/10 border-orange-500/40 text-orange-500" : "border-border/60 text-muted-foreground"
                  )}
                >
                  {m >= 1000 ? `${m / 1000}k` : m}
                </button>
              ))}
            </div>
            {todayData.steps > 0 && <ProgressBar value={todayData.steps} max={cp.steps} color={colorMap.orange} height={4} />}
          </div>

          {cp.cardio > 0 && (
            <div className="mb-5">
              <div className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase mb-2.5">Cardio Target: {cp.cardio} min</div>
              <div className="flex gap-1.5">
                {CARDIO_MS.map((m) => (
                  <button
                    key={m}
                    onClick={() => store.setCardio(m)}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg border font-mono text-[10px] font-medium transition-all active:scale-[0.98]",
                      todayData.cardio >= m ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-500" : "border-border/60 text-muted-foreground"
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
              "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left active:scale-[0.99]",
              todayData.strength ? "border-violet-500/40 bg-violet-500/5" : "border-border/60"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-md flex items-center justify-center border-[1.5px] transition-all flex-shrink-0",
              todayData.strength ? "bg-violet-500 border-violet-500" : "border-border/80 bg-background"
            )}>
              {todayData.strength && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <Dumbbell className="w-5 h-5" style={{ color: todayData.strength ? colorMap.violet : "var(--muted-foreground)" }} />
            <div className="flex-1">
              <div className="text-sm font-medium" style={todayData.strength ? { color: colorMap.violet } : {}}>Strength Training</div>
              <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">5x/week / Compound lifts / Progressive overload</div>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Weight Log */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-3">Weight Log</span>
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="kg today"
              step="0.1"
              min="20"
              max="400"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 font-mono bg-muted/20 h-11"
            />
            <Button onClick={handleSaveWeight} variant="outline" className="font-mono text-xs text-cyan-500 border-cyan-500/25 bg-cyan-500/5 h-11 px-5">
              Save
            </Button>
          </div>

          {store.weights.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 text-center py-6">No entries yet. Log your first weight above.</p>
          ) : (
            <>
              {store.weights.slice(-10).map((w, i, arr) => {
                const prev = i > 0 ? arr[i - 1].weight : null
                const diff = prev ? (w.weight - prev).toFixed(1) : null
                return (
                  <div key={w.date} className="flex justify-between items-center py-2.5 border-b border-border/20 last:border-b-0 group">
                    <span className="font-mono text-[10px] text-muted-foreground/70">{w.date}</span>
                    <div className="flex items-center gap-3">
                      {diff !== null && (
                        <span className="font-mono text-[10px] font-medium" style={{ color: parseFloat(diff) <= 0 ? colorMap.lime : colorMap.coral }}>
                          {parseFloat(diff) > 0 ? "+" : ""}{diff} kg
                        </span>
                      )}
                      <span className="text-base font-semibold text-cyan-500">{w.weight} kg</span>
                      <button
                        onClick={() => store.deleteWeight(w.date)}
                        className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 opacity-40 p-1 rounded-md hover:bg-destructive/10 transition-all"
                        title="Delete entry"
                      >
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                )
              })}
              {store.weights.length > 1 && (
                <div className="mt-3 p-3.5 bg-muted/10 rounded-xl flex justify-between items-center">
                  <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">Total Change</span>
                  <span className="font-semibold" style={{ color: store.weights[store.weights.length - 1].weight <= store.weights[0].weight ? colorMap.lime : colorMap.coral }}>
                    {(store.weights[store.weights.length - 1].weight - store.weights[0].weight).toFixed(1)} kg
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Select Phase */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">Select Current Phase</span>
          <div className="space-y-2">
            {FIT_PHASES.map((phase) => {
              const isActive = store.meta.fitnessPhase === phase.id
              const Icon = phaseIcons[phase.icon] || Flame
              return (
                <button
                  key={phase.id}
                  onClick={() => store.setFitPhase(phase.id)}
                  className={cn(
                    "w-full p-3.5 rounded-xl border transition-all text-left active:scale-[0.99]",
                    isActive && "border-l-[3px]"
                  )}
                  style={isActive ? { borderLeftColor: colorMap[phase.color], background: `${colorMap[phase.color]}08` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isActive ? `${colorMap[phase.color]}15` : "var(--muted)" }}>
                      <Icon className="w-5 h-5" style={{ color: isActive ? colorMap[phase.color] : "var(--muted-foreground)" }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={isActive ? { color: colorMap[phase.color] } : {}}>
                        {phase.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{phase.sub} / {phase.weight}</div>
                    </div>
                    {isActive && (
                      <span className="font-mono text-[9px] font-semibold px-2 py-1 rounded-md" style={{ color: colorMap[phase.color], background: `${colorMap[phase.color]}15` }}>Active</span>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-sm text-muted-foreground mt-3 ml-[52px] leading-relaxed">{phase.goal}</p>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fitness Rules */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">Fitness Rules</span>
          <div className="space-y-3.5">
            {FIT_RULES.map(([color, title, desc], i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colorMap[color] || colorMap.lime }} />
                <div>
                  <div className="text-sm font-medium text-foreground">{title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
