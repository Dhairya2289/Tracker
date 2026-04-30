"use client"

import { useStore } from "@/lib/store"
import { Target, ClipboardList, Utensils, Dumbbell, BarChart3, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "today", label: "Today", icon: Target },
  { id: "plan", label: "Plan", icon: ClipboardList },
  { id: "diet", label: "Diet", icon: Utensils },
  { id: "body", label: "Body", icon: Dumbbell },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "rules", label: "Rules", icon: Shield },
]

export function BottomNav() {
  const { currentView, setView } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border/60 safe-area-pb">
      <div className="grid grid-cols-6 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-3 px-1 min-h-[56px] transition-all active:opacity-70",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/4 right-1/4 h-[2px] rounded-b bg-primary" />
              )}
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className={cn(
                "text-[10px] font-medium tracking-wide mt-1.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground/80"
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
