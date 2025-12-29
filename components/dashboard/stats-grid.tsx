import { StatCard } from "./stat-card"
import { formatCurrency } from "@/lib/utils/format"

interface StatsGridProps {
  totalExpenses: number
  uniqueCategories: number
  expenseCount: number
}

export function StatsGrid({
  totalExpenses,
  uniqueCategories,
  expenseCount,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Expenses"
        value={formatCurrency(totalExpenses)}
        sublabel="All time"
      />
      <StatCard
        label="Categories"
        value={uniqueCategories.toString()}
        sublabel="Active"
      />
      <StatCard
        label="Transactions"
        value={expenseCount.toString()}
        sublabel="All time"
      />
      <StatCard
        label="Budget"
        value="--"
        sublabel="Not set"
      />
    </div>
  )
}

