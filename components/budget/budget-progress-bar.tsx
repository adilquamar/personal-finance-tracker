"use client"

import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/format"

interface BudgetProgressBarProps {
  spent: number
  budget: number
  percentUsed: number
  /** Show the currency labels beneath the bar */
  showLabels?: boolean
  /** Override the bar height. Defaults to "md" */
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
} as const

/**
 * Returns an interpolated color on a green → amber → red gradient
 * based on the budget usage percentage (0–100+).
 *
 * 0-50%   → green  (hsl 142)
 * 50-80%  → green → amber transition
 * 80-100% → amber → red transition
 * 100%+   → red   (hsl 0)
 */
function getProgressColor(percent: number): string {
  // Clamp for color calculation (visual only — bar width can exceed 100%)
  const p = Math.max(0, Math.min(percent, 120))

  if (p <= 50) {
    // Pure green range — hue stays at 142, saturation 71%, lightness 45%
    return "hsl(142, 71%, 45%)"
  }

  if (p <= 80) {
    // Green → Amber: hue 142 → 38, saturation 71% → 92%, lightness 45% → 50%
    const t = (p - 50) / 30
    const hue = 142 - t * (142 - 38)
    const sat = 71 + t * (92 - 71)
    const lit = 45 + t * (50 - 45)
    return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`
  }

  // 80% → 120%+: Amber → Red: hue 38 → 0, saturation 92% → 84%, lightness 50% → 46%
  const t = Math.min((p - 80) / 20, 1)
  const hue = 38 - t * 38
  const sat = 92 - t * (92 - 84)
  const lit = 50 - t * (50 - 46)
  return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lit)}%)`
}

export function BudgetProgressBar({
  spent,
  budget,
  percentUsed,
  showLabels = true,
  size = "md",
  className,
}: BudgetProgressBarProps) {
  const isExceeded = percentUsed > 100
  const displayPercent = Math.min(percentUsed, 100)
  const color = getProgressColor(percentUsed)

  return (
    <div className={cn("w-full", className)}>
      {/* Percentage label */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={cn(
            "text-xs font-medium",
            isExceeded ? "text-red-500" : "text-gray-700"
          )}
        >
          {Math.round(percentUsed)}% used
        </span>
        {isExceeded && (
          <span className="text-xs font-medium text-red-500">
            Over by {formatCurrency(spent - budget)}
          </span>
        )}
      </div>

      {/* Progress track */}
      <div
        className={cn(
          "w-full bg-gray-100 rounded-full overflow-hidden",
          sizeMap[size]
        )}
      >
        {/* Progress fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out"
          )}
          style={{
            width: `${displayPercent}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Spent / Budget labels */}
      {showLabels && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-500">
            {formatCurrency(spent)} spent
          </span>
          <span className="text-xs text-gray-500">
            {formatCurrency(budget)} budget
          </span>
        </div>
      )}
    </div>
  )
}
