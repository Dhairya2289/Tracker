"use client"

import { useStore } from "@/lib/store"
import { SYSTEM_RULES, MDCAT_BLOCK_INFO } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Clock, Smartphone, BookOpen, FileText, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.75 0.18 145)",
  coral: "oklch(0.70 0.20 25)",
  cyan: "oklch(0.78 0.12 200)",
  amber: "oklch(0.78 0.15 85)",
  violet: "oklch(0.72 0.15 290)",
  orange: "oklch(0.75 0.15 55)",
}

const coreRules = [
  { icon: Clock, title: "14 effective hours DAILY", sub: "Not 12. Not 13. 14." },
  { icon: "none", title: "No backlog carry forward", sub: "Today's chapter = today's completion" },
  { icon: FileText, title: "Same-day PYQs compulsory", sub: "Solve immediately after every lecture" },
  { icon: BookOpen, title: "NCERT line-by-line for Bio & Chem", sub: "Not skimming. Line. By. Line." },
  { icon: Smartphone, title: "Phone = OFF during blocks", sub: "It's not on silent. It's OFF." },
]

const focusCards = [
  { color: colorMap.lime, title: "Genetics + Ecology", sub: "= RANK DECIDER" },
  { color: colorMap.cyan, title: "Organic Chem", sub: "= SCORE BOOSTER" },
  { color: colorMap.amber, title: "English", sub: "= EASY MARKS" },
  { color: colorMap.violet, title: "GAT", sub: "= SMART PREP" },
]

export function RulesView() {
  const { expandedRule, setExpandedRule } = useStore()

  return (
    <div className="p-4 space-y-3 pb-20">
      {/* Core Rules */}
      <Card className="border-l-[3px] border-l-destructive">
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-destructive tracking-widest uppercase block mb-3">MDCAT Core Rules</span>
          <div className="space-y-3">
            {coreRules.map((rule, i) => {
              const Icon = rule.icon === "none" ? null : rule.icon
              return (
                <div key={i} className="flex gap-3 items-start pb-3 border-b border-border/30 last:border-b-0 last:pb-0">
                  {Icon ? (
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
                  ) : (
                    <div className="w-5 h-5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{rule.title}</div>
                    <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{rule.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <Card className="border-l-[3px] border-l-amber-500">
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-amber-500 tracking-widest uppercase block mb-3">Daily Schedule</span>
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {MDCAT_BLOCK_INFO.map((b) => (
              <div key={b.n} className="bg-card p-3 flex items-center gap-3">
                <div className="text-2xl font-bold text-muted-foreground/30 min-w-[24px]">{b.n}</div>
                <div>
                  <div className="font-mono text-[10px] text-amber-500">{b.dur} {b.time}</div>
                  <div className="text-sm font-semibold text-foreground">{b.task}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* The 12 System Rules */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block mb-1">The 12 System Rules</span>
          <div className="font-mono text-[10px] text-muted-foreground/60 mb-4">Tap to expand</div>
          <div className="space-y-1">
            {SYSTEM_RULES.map((rule) => {
              const isOpen = expandedRule === rule.num
              const color = colorMap[rule.color] || colorMap.lime
              return (
                <button
                  key={rule.num}
                  onClick={() => setExpandedRule(isOpen ? null : rule.num)}
                  className="w-full text-left"
                >
                  <div className={cn(
                    "flex gap-3 items-start py-3 border-b border-border/30 transition-all",
                    isOpen && "border-transparent"
                  )}>
                    <span className="font-mono text-xs font-bold min-w-[20px]" style={{ color }}>{rule.num}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{rule.title}</div>
                      {isOpen && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{rule.body}</p>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Focus Cards */}
      <div className="grid grid-cols-2 gap-2">
        {focusCards.map((card) => (
          <Card key={card.title} className="overflow-hidden relative">
            <CardContent className="p-3">
              <div className="font-mono text-[10px] text-muted-foreground mb-1">{card.sub}</div>
              <div className="text-sm font-bold" style={{ color: card.color }}>{card.title}</div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: card.color }} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reality Check */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="p-4">
          <div className="font-mono text-[10px] tracking-widest text-destructive mb-3">REALITY CHECK</div>
          <div className="font-semibold text-foreground mb-1">Follow this = 100% syllabus covered properly.</div>
          <div className="text-sm text-muted-foreground">Ignore this = watching lectures with zero retention.</div>
        </CardContent>
      </Card>
    </div>
  )
}
