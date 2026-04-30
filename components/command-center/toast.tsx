"use client"

import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Toast() {
  const { toast } = useStore()

  return (
    <div
      className={cn(
        "fixed bottom-[76px] left-1/2 -translate-x-1/2 z-[9999]",
        "bg-primary text-primary-foreground px-6 py-2.5",
        "font-mono text-[11px] font-bold tracking-wider rounded-md",
        "shadow-[0_0_24px_rgba(57,255,20,0.5)]",
        "pointer-events-none whitespace-nowrap",
        "transition-all duration-250",
        toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {toast}
    </div>
  )
}
