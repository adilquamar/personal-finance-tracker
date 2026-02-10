import { getBudgetPageData } from "@/app/actions/budget"
import { BudgetSnapshotCards } from "@/components/budget/budget-snapshot"
import { BudgetMonthlyBreakdown } from "@/components/budget/budget-monthly-breakdown"
import { BudgetPageContent } from "./_components/budget-page-content"

export default async function BudgetPage() {
  const data = await getBudgetPageData()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Budget</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your spending against your budgets
          </p>
        </div>

        {/* Overall Snapshot (current + last month) */}
        <div className="mb-8">
          <BudgetSnapshotCards
            currentMonth={data.currentMonthSnapshot}
            lastMonth={data.lastMonthSnapshot}
          />
        </div>

        {/* Monthly Breakdown ($ saved/exceeded per month) */}
        <div className="mb-8">
          <BudgetMonthlyBreakdown data={data.monthlyBreakdown} />
        </div>

        {/* Budget Table + Add/Edit Form Dialog */}
        <BudgetPageContent budgets={data.budgets} />
      </div>
    </div>
  )
}
