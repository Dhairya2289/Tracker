"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
  className?: string
}

export function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 5,
  color = "var(--primary)",
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  const center = size / 2

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label !== undefined && (
          <span
            className="font-semibold leading-none tracking-tight"
            style={{ color, fontSize: size < 70 ? "11px" : size < 100 ? "16px" : "24px" }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-muted-foreground/70 font-mono text-[9px] tracking-wider mt-1 uppercase">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
