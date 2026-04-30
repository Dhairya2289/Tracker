"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { FIT_PHASES, FIT_RULES, STEP_MS, CARDIO_MS } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Dumbbell, Footprints, Bike, Flame, Target, BookOpen } from "lucide-react"
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

const phaseIcons: Record<string, any> = {
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
    <div className="p-4 space-y-3 pb-20">
      {/* Overview */}
      <Card className="border-l-[3px]" style={{ borderLeftColor: colorMap[cp.color] }}>
        <CardContent className="p-4 text-center">
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">120 KG to 75 KG 6 PHASES</div>
          <div className="text-2xl font-bold text-foreground">FAT LOSS PLAN</div>
          <div className="flex gap-1 mt-4 justify-center">
            {FIT_PHASES.map((ph, i) => (
              <div
                key={ph.id}
                className={cn("h-1.5 flex-1 rounded-full max-w-[40px]", i <= store.meta.fitnessPhase ? "" : "bg-muted/30")}
                style={i <= store.meta.fitnessPhase ? { background: colorMap[ph.color], boxShadow: `0 0 8px ${colorMap[ph.color]}` } : {}}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Activity */}
      <Card className="border-l-[3px]" style={{ borderLeftColor: colorMap[cp.color], background: `${colorMap[cp.color]}08` }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: colorMap[cp.color] }}>
              Today&apos;s Activity
            </span>
            <span className="font-mono text-xs font-bold" style={{ color: fd === ft ? colorMap.lime : "var(--muted-foreground)" }}>
              {fd}/{ft} done
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
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-2">Steps Target: {cp.steps.toLocaleString()}</div>
            <div className="flex gap-1 mb-2">
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
            {todayData.steps > 0 && <ProgressBar value={todayData.steps} max={cp.steps} color={colorMap.orange} height={5} />}
          </div>

          {cp.cardio > 0 && (
            <div className="mb-4">
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-2">Cardio Target: {cp.cardio} min</div>
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

      {/* Weight Log */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-3">Weight Log</span>
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="kg today"
              step="0.1"
              min="20"
              max="400"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 font-mono bg-muted/30"
            />
            <Button onClick={handleSaveWeight} variant="outline" className="font-mono text-xs text-cyan-500 border-cyan-500/30 bg-cyan-500/10">
              SAVE
            </Button>
          </div>

          {store.weights.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No entries yet. Log your first weight above.</p>
          ) : (
            <>
              {store.weights.slice(-10).map((w, i, arr) => {
                const prev = i > 0 ? arr[i - 1].weight : null
                const diff = prev ? (w.weight - prev).toFixed(1) : null
                return (
                  <div key={w.date} className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0">
                    <span className="font-mono text-[10px] text-muted-foreground">{w.date}</span>
                    <div className="flex items-center gap-3">
                      {diff !== null && (
                        <span className="font-mono text-[10px] font-bold" style={{ color: parseFloat(diff) <= 0 ? colorMap.lime : colorMap.coral }}>
                          {parseFloat(diff) > 0 ? "+" : ""}{diff} kg
                        </span>
                      )}
                      <span className="text-lg font-bold text-cyan-500">{w.weight} kg</span>
                    </div>
                  </div>
                )
              })}
              {store.weights.length > 1 && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                  <span className="font-mono text-[10px] text-muted-foreground">TOTAL CHANGE</span>
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
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-3">Select Current Phase</span>
          <div className="space-y-2">
            {FIT_PHASES.map((phase) => {
              const isActive = store.meta.fitnessPhase === phase.id
              const Icon = phaseIcons[phase.icon] || Flame
              return (
                <button
                  key={phase.id}
                  onClick={() => store.setFitPhase(phase.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border transition-all text-left",
                    isActive && "border-l-[3px]"
                  )}
                  style={isActive ? { borderLeftColor: colorMap[phase.color], background: `${colorMap[phase.color]}08` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 flex-shrink-0" style={{ color: isActive ? colorMap[phase.color] : "var(--muted-foreground)" }} />
                    <div className="flex-1">
                      <div className="font-semibold" style={isActive ? { color: colorMap[phase.color] } : {}}>
                        {phase.name}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">{phase.sub} {phase.weight}</div>
                    </div>
                    {isActive && (
                      <span className="font-mono text-[10px] font-bold" style={{ color: colorMap[phase.color] }}>ACTIVE</span>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-sm text-muted-foreground mt-2 ml-9 leading-relaxed">{phase.goal}</p>
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
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-3">Fitness Rules</span>
          <div className="space-y-3">
            {FIT_RULES.map(([color, title, desc], i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: colorMap[color] || colorMap.lime }} />
                <div>
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
