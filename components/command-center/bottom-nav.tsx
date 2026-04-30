"use client"

import { useStore } from "@/lib/store"
import { Zap, ClipboardList, Utensils, Dumbbell, BarChart3, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "today", label: "TODAY", icon: Zap },
  { id: "plan", label: "PLAN", icon: ClipboardList },
  { id: "diet", label: "DIET", icon: Utensils },
  { id: "body", label: "BODY", icon: Dumbbell },
  { id: "stats", label: "STATS", icon: BarChart3 },
  { id: "rules", label: "RULES", icon: Shield },
]

export function BottomNav() {
  const { currentView, setView } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-6">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2.5 px-1 min-h-[52px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-[15%] right-[15%] h-[2px] rounded-b bg-primary"
                  style={{ boxShadow: "0 0 10px oklch(0.75 0.18 145)" }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-mono text-[10px] font-semibold tracking-wide mt-1">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
