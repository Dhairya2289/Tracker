"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { SYSTEM_RULES, MDCAT_BLOCK_INFO } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Clock, Smartphone, BookOpen, FileText, RotateCcw, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap: Record<string, string> = {
  lime: "oklch(0.68 0.14 155)",
  coral: "oklch(0.65 0.16 25)",
  cyan: "oklch(0.72 0.10 200)",
  amber: "oklch(0.72 0.12 85)",
  violet: "oklch(0.68 0.12 280)",
  orange: "oklch(0.70 0.12 55)",
}

const coreRules = [
  { icon: Clock, title: "14 effective hours DAILY", sub: "Not 12. Not 13. 14." },
  { icon: null, title: "No backlog carry forward", sub: "Today's chapter = today's completion" },
  { icon: FileText, title: "Same-day PYQs compulsory", sub: "Solve immediately after every lecture" },
  { icon: BookOpen, title: "NCERT line-by-line for Bio & Chem", sub: "Not skimming. Line. By. Line." },
  { icon: Smartphone, title: "Phone = OFF during blocks", sub: "It's not on silent. It's OFF." },
]

const focusCards = [
  { color: colorMap.lime, title: "Genetics + Ecology", sub: "Rank Decider" },
  { color: colorMap.cyan, title: "Organic Chem", sub: "Score Booster" },
  { color: colorMap.amber, title: "English", sub: "Easy Marks" },
  { color: colorMap.violet, title: "GAT", sub: "Smart Prep" },
]

export function RulesView() {
  const { expandedRule, setExpandedRule } = useStore()

  return (
    <div className="px-4 py-5 space-y-4 pb-24">
      {/* Core Rules */}
      <Card className="border-l-[3px] border-l-destructive">
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-destructive tracking-widest uppercase block mb-4">MDCAT Core Rules</span>
          <div className="space-y-4">
            {coreRules.map((rule, i) => {
              const Icon = rule.icon
              return (
                <div key={i} className="flex gap-3 items-start pb-4 border-b border-border/20 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center flex-shrink-0">
                    {Icon ? (
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{rule.title}</div>
                    <div className="font-mono text-[10px] text-muted-foreground/70 mt-0.5">{rule.sub}</div>
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
          <span className="font-mono text-[10px] text-amber-500 tracking-widest uppercase block mb-4">Daily Schedule</span>
          <div className="grid grid-cols-2 gap-2">
            {MDCAT_BLOCK_INFO.map((b) => (
              <div key={b.n} className="bg-muted/10 rounded-xl p-3 flex items-center gap-3">
                <div className="text-lg font-bold text-muted-foreground/30 min-w-[20px]">{b.n}</div>
                <div>
                  <div className="font-mono text-[9px] text-amber-500/80">{b.dur} / {b.time}</div>
                  <div className="text-xs font-medium text-foreground mt-0.5 leading-tight">{b.task}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* The 12 System Rules */}
      <Card>
        <CardContent className="p-4">
          <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-1">The 12 System Rules</span>
          <div className="font-mono text-[10px] text-muted-foreground/50 mb-4">Tap to expand</div>
          <div className="space-y-0.5">
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
                    "flex gap-3 items-start py-3.5 border-b border-border/20 transition-all",
                    isOpen && "border-transparent"
                  )}>
                    <span className="font-mono text-xs font-semibold min-w-[20px]" style={{ color }}>{rule.num}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">{rule.title}</div>
                      {isOpen && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{rule.body}</p>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Focus Cards */}
      <div className="grid grid-cols-2 gap-3">
        {focusCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-1">{card.sub}</div>
              <div className="text-sm font-semibold" style={{ color: card.color }}>{card.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reality Check */}
      <Card className="bg-destructive/5 border-destructive/15">
        <CardContent className="p-4">
          <div className="font-mono text-[10px] tracking-widest text-destructive/80 mb-3 uppercase">Reality Check</div>
          <div className="font-medium text-sm text-foreground mb-1">Follow this = 100% syllabus covered properly.</div>
          <div className="text-sm text-muted-foreground">Ignore this = watching lectures with zero retention.</div>
        </CardContent>
      </Card>

      {/* Reset & Data Management */}
      <ResetSection />
    </div>
  )
}

function ResetSection() {
  const store = useStore()
  const [showConfirmToday, setShowConfirmToday] = useState(false)
  const [showConfirmAll, setShowConfirmAll] = useState(false)

  return (
    <Card className="border-border/40">
      <CardContent className="p-4">
        <span className="font-mono text-[10px] text-muted-foreground/70 tracking-widest uppercase block mb-4">Data Management</span>
        
        {/* Reset Today */}
        <div className="mb-4">
          {!showConfirmToday ? (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 border-border/60"
              onClick={() => setShowConfirmToday(true)}
            >
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <div className="text-left">
                <div className="text-sm font-medium">Reset Today&apos;s Progress</div>
                <div className="font-mono text-[10px] text-muted-foreground/70">Clear all progress for today only</div>
              </div>
            </Button>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
              <div className="text-sm font-medium text-amber-500">Reset today&apos;s progress?</div>
              <div className="text-xs text-muted-foreground">This will clear all blocks, meals, MCQs, and fitness for today.</div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-border/60"
                  onClick={() => setShowConfirmToday(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                  onClick={() => {
                    store.resetToday()
                    setShowConfirmToday(false)
                  }}
                >
                  Reset Today
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Data */}
        {!showConfirmAll ? (
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 border-destructive/20 bg-destructive/5 hover:bg-destructive/10"
            onClick={() => setShowConfirmAll(true)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
            <div className="text-left">
              <div className="text-sm font-medium text-destructive">Clear All Data</div>
              <div className="font-mono text-[10px] text-muted-foreground/70">Permanently delete everything</div>
            </div>
          </Button>
        ) : (
          <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
            <div className="text-sm font-medium text-destructive">Delete all data permanently?</div>
            <div className="text-xs text-muted-foreground">This will remove ALL history, streaks, MDCAT progress, weights, and settings. This cannot be undone.</div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-border/60"
                onClick={() => setShowConfirmAll(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                onClick={() => {
                  store.resetAllData()
                  setShowConfirmAll(false)
                }}
              >
                Delete All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
