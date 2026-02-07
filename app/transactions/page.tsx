import { Suspense } from "react"
import { requireAuth } from "@/lib/auth"
import { getTransactionsByDateRange } from "@/app/actions/expenses"
import { getDateRangeFromParams } from "@/lib/utils/date-range"
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense"
import { TimeRangeSelector, type TimeRange } from "@/components/analytics/time-range-selector"
import { CustomDateRange } from "@/components/analytics/custom-date-range"
import { TransactionsTotalBanner } from "@/components/transactions/transactions-total-banner"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { CategoryFilter } from "@/components/transactions/category-filter"

interface TransactionsPageProps {
  searchParams: Promise<{
    range?: string
    startDate?: string
    endDate?: string
    category?: string
  }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  // Ensure user is authenticated
  await requireAuth()

  // Read URL search params
  const params = await searchParams
  const range = (params.range as TimeRange) || "month"
  const customStartDate = params.startDate
  const customEndDate = params.endDate
  const category = EXPENSE_CATEGORIES.includes(params.category as ExpenseCategory)
    ? (params.category as ExpenseCategory)
    : undefined

  // Calculate date range from params
  const { startDate, endDate } = getDateRangeFromParams(
    range,
    customStartDate,
    customEndDate
  )

  // Fetch transactions for the date range (optionally filtered by category)
  const { expenses, total } = await getTransactionsByDateRange({
    startDate,
    endDate,
    category,
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">View your transaction history</p>
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

        {/* Category Filter */}
        <div className="mb-6">
          <Suspense fallback={null}>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Total Spending Banner */}
        <TransactionsTotalBanner total={total} count={expenses.length} className="mb-6" />

        {/* Transactions Table */}
        <TransactionsList expenses={expenses} />
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
