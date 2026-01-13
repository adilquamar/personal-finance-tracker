import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/format"
import type { AnalyticsSummary } from "@/app/actions/analytics"

interface SummaryStatsProps {
  /** Analytics summary data */
  summary: AnalyticsSummary
  /** Additional CSS classes */
  className?: string
}

/**
 * Individual stat card component for summary stats
 */
function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string
  variant?: "default" | "success" | "warning"
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={cn(
          "text-2xl font-medium",
          variant === "success" && "text-green-600",
          variant === "warning" && "text-red-500",
          variant === "default" && "text-gray-900"
        )}
      >
        {value}
      </p>
    </div>
  )
}

/**
 * Summary statistics grid displaying key analytics metrics.
 * Shows Total Spent, Avg Daily, Remaining, and Budget Used in a 2x2 grid.
 */
export function SummaryStats({ summary, className }: SummaryStatsProps) {
  const { totalSpent, avgDaily, remaining, budgetUsed } = summary

  // Determine budget used variant based on percentage
  const budgetVariant: "default" | "success" | "warning" =
    budgetUsed > 100 ? "warning" : budgetUsed > 80 ? "default" : "success"

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <StatCard label="Total Spent" value={formatCurrency(totalSpent)} />
      <StatCard label="Avg Daily" value={formatCurrency(avgDaily)} />
      <StatCard
        label="Remaining"
        value={formatCurrency(remaining)}
        variant={remaining <= 0 ? "warning" : "success"}
      />
      <StatCard
        label="Budget Used"
        value={`${budgetUsed}%`}
        variant={budgetVariant}
      />
    </div>
  )
}

