"use client"

import { ContentCard } from "@/components/ui/content-card"
import { formatCurrency } from "@/lib/utils/format"
import type { BudgetSnapshot } from "@/types/budget"
import { cn } from "@/lib/utils"

interface BudgetSnapshotCardsProps {
  currentMonth: BudgetSnapshot
  lastMonth: BudgetSnapshot
}

function SnapshotCard({
  snapshot,
  label,
}: {
  snapshot: BudgetSnapshot
  label: string
}) {
  const isUnderBudget = snapshot.difference >= 0

  return (
    <ContentCard padding="md">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{label}</h3>

      {/* Net difference — primary stat */}
      <p
        className={cn(
          "text-2xl font-medium",
          isUnderBudget ? "text-green-600" : "text-red-500"
        )}
      >
        {isUnderBudget ? "+" : "-"}
        {formatCurrency(Math.abs(snapshot.difference))}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {isUnderBudget ? "under budget" : "over budget"}
      </p>

      {/* Budget / Spent breakdown */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(snapshot.totalBudget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(snapshot.totalSpent)}
          </p>
        </div>
      </div>
    </ContentCard>
  )
}

export function BudgetSnapshotCards({
  currentMonth,
  lastMonth,
}: BudgetSnapshotCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SnapshotCard snapshot={currentMonth} label="This Month" />
      <SnapshotCard snapshot={lastMonth} label="Last Month" />
    </div>
  )
}
