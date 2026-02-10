"use client"

import { ContentCard } from "@/components/ui/content-card"
import { formatCurrency } from "@/lib/utils/format"
import { cn } from "@/lib/utils"
import type { MonthlyBudgetResult } from "@/types/budget"
import { EXPENSE_CATEGORY_LABELS } from "@/types/expense"

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

interface BudgetMonthlyBreakdownProps {
  data: MonthlyBudgetResult[]
}

/**
 * Formats a difference value as a signed currency string.
 * Positive → "+$120.00", Negative → "-$45.50", Zero → "$0.00"
 */
function formatDifference(value: number): string {
  if (value === 0) return formatCurrency(0)
  const prefix = value > 0 ? "+" : "-"
  return `${prefix}${formatCurrency(Math.abs(value))}`
}

export function BudgetMonthlyBreakdown({
  data,
}: BudgetMonthlyBreakdownProps) {
  const currentMonth = new Date().getMonth() + 1 // 1–12

  if (data.length === 0) {
    return (
      <ContentCard>
        <h2 className="text-lg font-medium text-gray-900">
          Monthly Breakdown
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          No monthly budgets set. Add a monthly budget to see your per-month
          breakdown.
        </p>
      </ContentCard>
    )
  }

  return (
    <ContentCard>
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Monthly Breakdown
      </h2>

      <div className="space-y-6">
        {data.map((result) => (
          <div key={result.category}>
            {/* Category header with YTD total */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {EXPENSE_CATEGORY_LABELS[result.category]}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  result.totalDifference > 0
                    ? "text-green-600"
                    : result.totalDifference < 0
                      ? "text-red-500"
                      : "text-gray-500"
                )}
              >
                YTD: {formatDifference(result.totalDifference)}
              </span>
            </div>

            {/* Month cells — horizontally scrollable on mobile */}
            <div className="overflow-x-auto -mx-6 px-6">
              <div className="flex gap-2 min-w-max pb-1">
                {Array.from({ length: currentMonth }, (_, i) => i + 1).map(
                  (month) => {
                    const difference = result.months[month] ?? 0

                    return (
                      <div
                        key={month}
                        className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2 min-w-[72px]"
                      >
                        <span className="text-xs text-gray-500 mb-1">
                          {MONTH_LABELS[month - 1]}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            difference > 0
                              ? "text-green-600"
                              : difference < 0
                                ? "text-red-500"
                                : "text-gray-400"
                          )}
                        >
                          {formatDifference(difference)}
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  )
}
