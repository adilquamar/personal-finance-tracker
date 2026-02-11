import { ContentCard } from "@/components/ui/content-card"
import { formatCurrency } from "@/lib/utils/format"
import { DollarSign, CalendarCheck, Clock, TrendingUp } from "lucide-react"

interface SubscriptionStatsProps {
  stats: {
    totalMonthlyCost: number
    totalYearlyCost: number
    paidThisMonth: number
    upcomingThisMonth: number
  }
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  accentClass: string
}

function StatCard({ label, value, icon, accentClass }: StatCardProps) {
  return (
    <ContentCard padding="sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 truncate">{label}</p>
          <p className="text-lg font-medium text-gray-900">
            {formatCurrency(value)}
          </p>
        </div>
      </div>
    </ContentCard>
  )
}

/**
 * Displays a row of stats cards showing subscription cost summaries.
 * Uses ContentCard with padding="sm" per design rules.
 */
export function SubscriptionStats({ stats }: SubscriptionStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Monthly Total"
        value={stats.totalMonthlyCost}
        icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
        accentClass="bg-indigo-50"
      />
      <StatCard
        label="Yearly Total"
        value={stats.totalYearlyCost}
        icon={<TrendingUp className="h-5 w-5 text-indigo-600" />}
        accentClass="bg-indigo-50"
      />
      <StatCard
        label="Paid This Month"
        value={stats.paidThisMonth}
        icon={<CalendarCheck className="h-5 w-5 text-green-600" />}
        accentClass="bg-green-50"
      />
      <StatCard
        label="Upcoming This Month"
        value={stats.upcomingThisMonth}
        icon={<Clock className="h-5 w-5 text-indigo-600" />}
        accentClass="bg-indigo-50"
      />
    </div>
  )
}
