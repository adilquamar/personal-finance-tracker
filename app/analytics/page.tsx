import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { getAnalyticsData } from "@/app/actions/analytics"
import { getDateRangeFromParams } from "@/lib/utils/date-range"
import { TimeRangeSelector, type TimeRange } from "@/components/analytics/time-range-selector"
import { CustomDateRange } from "@/components/analytics/custom-date-range"
import { SummaryStats } from "@/components/analytics/summary-stats"
import { SpendingChart } from "@/components/analytics/spending-chart"
import { TopCategories } from "@/components/analytics/top-categories"

interface AnalyticsPageProps {
  searchParams: Promise<{
    range?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  // Ensure user is authenticated
  await requireAuth()

  // Read URL search params
  const params = await searchParams
  const range = (params.range as TimeRange) || "month"
  const customStartDate = params.startDate
  const customEndDate = params.endDate

  // Calculate date range from params
  const { startDate, endDate } = getDateRangeFromParams(
    range,
    customStartDate,
    customEndDate
  )

  // Fetch all analytics data in one efficient call
  const { summary, trend, categories } = await getAnalyticsData(startDate, endDate)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your spending trends</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <Suspense fallback={<TimeRangeSelectorFallback />}>
            <TimeRangeSelector defaultRange={range} />
          </Suspense>
        </div>

        {/* Custom Date Range (shown only when range is "custom") */}
        <Suspense fallback={null}>
          <CustomDateRange className="mb-6" />
        </Suspense>

        {/* Summary Stats Grid */}
        <SummaryStats summary={summary} className="mb-6" />

        {/* Charts Section - Two Column on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Trend Chart */}
          <SpendingChart data={trend} />

          {/* Top Categories */}
          <TopCategories categories={categories} />
        </div>
      </div>
    </div>
  )
}

/**
 * Fallback for TimeRangeSelector while loading
 */
function TimeRangeSelectorFallback() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-10 bg-gray-100 rounded-lg animate-pulse"
        />
      ))}
    </div>
  )
}
