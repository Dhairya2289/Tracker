"use client"

import { useStore } from "@/lib/store"
import { Header } from "./header"
import { StatsBar } from "./stats-bar"
import { BottomNav } from "./bottom-nav"
import { TodayView } from "./views/today-view"
import { PlanView } from "./views/plan-view"
import { DietView } from "./views/diet-view"
import { BodyView } from "./views/body-view"
import { StatsView } from "./views/stats-view"
import { RulesView } from "./views/rules-view"

export function CommandCenter() {
  const { currentView } = useStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.25 0.02 280) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,2,8,0.7) 100%)",
        }}
      />

      <div className="relative z-10">
        <Header />
        <StatsBar />

        <main className="pb-16">
          {currentView === "today" && <TodayView />}
          {currentView === "plan" && <PlanView />}
          {currentView === "diet" && <DietView />}
          {currentView === "body" && <BodyView />}
          {currentView === "stats" && <StatsView />}
          {currentView === "rules" && <RulesView />}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
