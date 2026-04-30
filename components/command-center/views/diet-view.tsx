"use client"

import { useStore } from "@/lib/store"
import { MEALS, TOTAL_KCAL, TOTAL_PRO } from "@/lib/data"
import { ProgressBar } from "../progress-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sunrise, Sun, Sunset, Moon, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.68 0.14 155)",
  coral: "oklch(0.65 0.16 25)",
  cyan: "oklch(0.72 0.10 200)",
  amber: "oklch(0.72 0.12 85)",
  violet: "oklch(0.68 0.12 280)",
  orange: "oklch(0.70 0.12 55)",
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
    <div className="px-4 py-5 space-y-4 pb-24">
      {/* Summary */}
      <Card>
        <CardContent className="p-5 text-center">
          <div className="font-mono text-[10px] text-muted-foreground/70 tracking-widest mb-3 uppercase">UP Ovo-Veg No Whey</div>
          <div className="text-3xl font-bold text-foreground tracking-tight">{TOTAL_KCAL} kcal</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(TOTAL_PRO)}g protein, locally available</div>
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
          <div key={s.l} className="bg-card rounded-xl border border-border/60 p-3 text-center">
            <div className="text-base font-semibold" style={{ color: s.c }}>
              {s.v}
              <span className="text-[9px] opacity-50 ml-0.5">{s.u}</span>
            </div>
            <div className="font-mono text-[9px] text-muted-foreground/70 mt-1 uppercase">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">Calories</span>
              <span className="font-mono text-xs font-semibold text-amber-500">{kcalDone} / {TOTAL_KCAL}</span>
            </div>
            <ProgressBar value={kcalDone} max={TOTAL_KCAL} color={colorMap.amber} height={5} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase">Protein</span>
              <span className="font-mono text-xs font-semibold text-primary">{Math.round(proDone)}g / {Math.round(TOTAL_PRO)}g</span>
            </div>
            <ProgressBar value={proDone} max={TOTAL_PRO} color={colorMap.lime} height={5} />
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
            )}
            style={{ borderLeftColor: isLogged ? color : "transparent" }}
          >
            <button
              onClick={() => store.setExpandedMeal(isOpen ? null : meal.id)}
              className="w-full p-4 flex items-center gap-3 text-left active:opacity-80"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm" style={{ color: isLogged ? color : "var(--foreground)" }}>{meal.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{meal.hindi} / {meal.time}</div>
              </div>
              <div className="text-right mr-2">
                <div className="text-base font-semibold" style={{ color }}>{meal.kcal}</div>
                <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">kcal</div>
              </div>
              <div className="text-right mr-2">
                <div className="text-base font-semibold text-primary">{meal.pro}g</div>
                <div className="font-mono text-[9px] text-muted-foreground/60 uppercase">pro</div>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground/60 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
              <div className="border-t border-border/40">
                {meal.items.map((item, i) => (
                  <div key={i} className="px-4 py-3 text-sm text-muted-foreground border-b border-border/20 last:border-b-0">
                    {item}
                  </div>
                ))}
                <div className="m-4 p-3.5 rounded-xl flex items-start gap-2.5" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                  <p className="text-sm text-muted-foreground leading-relaxed">{meal.note}</p>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    onClick={() => store.toggleMeal(meal.id)}
                    variant="outline"
                    className="w-full font-mono text-xs tracking-wide h-11"
                    style={{
                      background: isLogged ? `${color}15` : "var(--muted)",
                      borderColor: isLogged ? `${color}40` : "var(--border)",
                      color: isLogged ? color : "var(--muted-foreground)",
                    }}
                  >
                    {isLogged ? "Logged - Tap to undo" : "Mark as Eaten"}
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
