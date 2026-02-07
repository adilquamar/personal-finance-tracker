import { requireAuth } from "@/lib/auth"
import { getRecentExpenses, getMonthlySpendingComparison } from "@/app/actions/expenses"
import { VerificationSuccessAlert } from "@/components/auth"
import {
  WelcomeSection,
  StatsGrid,
  AddExpenseSection,
  RecentTransactionsSection,
  MonthlySpendingChart,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await requireAuth()

  // Fetch data in parallel
  const [expenses, monthlyComparison] = await Promise.all([
    getRecentExpenses(7),
    getMonthlySpendingComparison(),
  ])

  // Derive monthly totals from comparison data
  const lastPoint = monthlyComparison[monthlyComparison.length - 1]
  const currentMonthTotal =
    monthlyComparison.findLast((p) => p.currentMonth != null)?.currentMonth ?? 0
  const lastMonthTotal = lastPoint?.lastMonth ?? 0

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Email Verification Success Alert */}
        <VerificationSuccessAlert />

        {/* Welcome Section */}
        <WelcomeSection fullName={user.fullName} />

        {/* Stats Grid */}
        <StatsGrid
          currentMonthTotal={currentMonthTotal}
          lastMonthTotal={lastMonthTotal}
        />

        {/* Add Expense Form */}
        <div className="mb-8">
          <AddExpenseSection />
        </div>

        {/* Recent Transactions */}
        <RecentTransactionsSection expenses={expenses} />

        {/* Monthly Spending Comparison Chart */}
        <MonthlySpendingChart data={monthlyComparison} className="mt-8" />
      </div>
    </div>
  )
}
