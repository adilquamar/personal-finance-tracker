import { requireAuth } from "@/lib/auth"
import { getRecentExpenses, getTotalExpenses, getExpenseCount } from "@/app/actions/expenses"
import { VerificationSuccessAlert } from "@/components/auth"
import {
  WelcomeSection,
  StatsGrid,
  AddExpenseSection,
  QuickActionsSection,
  RecentTransactionsSection,
} from "@/components/dashboard"

export default async function DashboardPage() {
  const user = await requireAuth()

  // Fetch data in parallel
  const [expenses, totalExpenses, expenseCount] = await Promise.all([
    getRecentExpenses(10),
    getTotalExpenses(),
    getExpenseCount(),
  ])

  // Get unique categories count
  const uniqueCategories = new Set(expenses.map((e) => e.category)).size

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Email Verification Success Alert */}
        <VerificationSuccessAlert />

        {/* Welcome Section */}
        <WelcomeSection fullName={user.fullName} />

        {/* Stats Grid */}
        <StatsGrid
          totalExpenses={totalExpenses}
          uniqueCategories={uniqueCategories}
          expenseCount={expenseCount}
        />

        {/* Two Column Layout for Form and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Add Expense Form Card */}
          <AddExpenseSection />

          {/* Quick Actions Card */}
          <QuickActionsSection />
        </div>

        {/* Recent Transactions */}
        <RecentTransactionsSection expenses={expenses} />
      </div>
    </div>
  )
}
