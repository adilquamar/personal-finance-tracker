import { StatCard } from "./stat-card"
import { formatCurrency } from "@/lib/utils/format"

// Placeholder budget values until user budgets are implemented
const MONTHLY_BUDGET = 2000
const YEARLY_BUDGET = 24000

interface StatsGridProps {
  currentMonthTotal: number
  lastMonthTotal: number
}

export function StatsGrid({
  currentMonthTotal,
  lastMonthTotal,
}: StatsGridProps) {
  const monthlyRemaining = MONTHLY_BUDGET - currentMonthTotal
  const yearlyRemaining = YEARLY_BUDGET - currentMonthTotal // Placeholder: only uses current month for now

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="This Month"
        value={formatCurrency(currentMonthTotal)}
        sublabel="Total spending"
      />
      <StatCard
        label="Last Month"
        value={formatCurrency(lastMonthTotal)}
        sublabel="Total spending"
      />
      <StatCard
        label="Monthly Budget Remaining"
        value={formatCurrency(monthlyRemaining)}
        sublabel={`of ${formatCurrency(MONTHLY_BUDGET)} budget`}
      />
      <StatCard
        label="Yearly Budget Remaining"
        value={formatCurrency(yearlyRemaining)}
        sublabel={`of ${formatCurrency(YEARLY_BUDGET)} budget`}
      />
    </div>
  )
}

