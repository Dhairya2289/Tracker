"use client"

import { useStore } from "@/lib/store"
import { MEALS, TOTAL_KCAL, TOTAL_PRO } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sunrise, Sun, Sunset, Moon, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.75 0.18 145)",
  coral: "oklch(0.70 0.20 25)",
  cyan: "oklch(0.78 0.12 200)",
  amber: "oklch(0.78 0.15 85)",
  violet: "oklch(0.72 0.15 290)",
  orange: "oklch(0.75 0.15 55)",
}

const mealIcons = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
}

export function DietView() {
  const store = useStore()
  const todayData = store.getTodayData()
  const kcalDone = store.getKcalDone()
  const proDone = store.getProDone()
  const expandedMeal = store.expandedMeal

  return (
    <div className="p-4 space-y-3 pb-20">
      {/* Summary */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest mb-2">UP OVO-VEG NO WHEY</div>
          <div className="text-3xl font-bold text-foreground">{TOTAL_KCAL} KCAL</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(TOTAL_PRO)}g protein locally available</div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { l: "Plan", v: TOTAL_KCAL, u: "kcal", c: "var(--foreground)" },
          { l: "Protein", v: Math.round(TOTAL_PRO), u: "g", c: colorMap.lime },
          { l: "Eaten", v: kcalDone, u: "kcal", c: colorMap.amber },
          { l: "Left", v: Math.max(TOTAL_KCAL - kcalDone, 0), u: "kcal", c: "var(--muted-foreground)" },
        ].map((s) => (
          <div key={s.l} className="bg-card rounded-lg border border-border p-2.5 text-center">
            <div className="text-lg font-bold" style={{ color: s.c }}>
              {s.v}
              <span className="text-[9px] opacity-50 ml-0.5">{s.u}</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">CALORIES</span>
              <span className="font-mono text-xs font-bold text-amber-500">{kcalDone} / {TOTAL_KCAL}</span>
            </div>
            <ProgressBar value={kcalDone} max={TOTAL_KCAL} color={colorMap.amber} height={6} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">PROTEIN</span>
              <span className="font-mono text-xs font-bold text-primary">{Math.round(proDone)}g / {Math.round(TOTAL_PRO)}g</span>
            </div>
            <ProgressBar value={proDone} max={TOTAL_PRO} color={colorMap.lime} height={6} />
          </div>
        </CardContent>
      </Card>

      {/* Meal Cards */}
      {MEALS.map((meal) => {
        const isOpen = expandedMeal === meal.id
        const isLogged = todayData.meals[meal.id]
        const color = colorMap[meal.color]
        const Icon = mealIcons[meal.icon as keyof typeof mealIcons] || Sun

        return (
          <Card
            key={meal.id}
            className={cn(
              "overflow-hidden transition-all border-l-[3px]",
              isLogged && "shadow-md"
            )}
            style={{ borderLeftColor: isLogged ? color : "var(--border)", borderColor: isLogged ? `${color}40` : undefined }}
          >
            <button
              onClick={() => store.setExpandedMeal(isOpen ? null : meal.id)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <Icon className="w-6 h-6 flex-shrink-0" style={{ color: isLogged ? color : "var(--muted-foreground)" }} />
              <div className="flex-1">
                <div className="font-semibold" style={{ color: isLogged ? color : "var(--foreground)" }}>{meal.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{meal.hindi} {meal.time}</div>
              </div>
              <div className="text-right mr-2">
                <div className="text-lg font-bold" style={{ color }}>{meal.kcal}</div>
                <div className="font-mono text-[9px] text-muted-foreground">KCAL</div>
              </div>
              <div className="text-right mr-2">
                <div className="text-lg font-bold text-primary">{meal.pro}g</div>
                <div className="font-mono text-[9px] text-muted-foreground">PRO</div>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
              <div className="border-t border-border/50">
                {meal.items.map((item, i) => (
                  <div key={i} className="px-4 py-2.5 text-sm text-muted-foreground border-b border-border/30 last:border-b-0">
                    {item}
                  </div>
                ))}
                <div className="m-4 p-3 rounded-lg flex items-start gap-2" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{meal.note}</p>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    onClick={() => store.toggleMeal(meal.id)}
                    variant="outline"
                    className="w-full font-mono text-xs tracking-wider"
                    style={{
                      background: isLogged ? `${color}20` : "var(--muted)",
                      borderColor: isLogged ? `${color}60` : "var(--border)",
                      color: isLogged ? color : "var(--muted-foreground)",
                    }}
                  >
                    {isLogged ? "LOGGED - Tap to undo" : "MARK AS EATEN"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
