"use client"

import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function SavedFlash() {
  const { showSaved } = useStore()

  return (
    <div
      className={cn(
        "fixed top-[70px] right-3.5 z-[500] font-mono text-[11px] text-primary tracking-widest",
        "bg-primary/10 border border-primary/25 rounded-full px-3 py-1.5",
        "pointer-events-none transition-opacity duration-300",
        showSaved ? "opacity-100" : "opacity-0"
      )}
    >
      ✓ SAVED
    </div>
  )
}
