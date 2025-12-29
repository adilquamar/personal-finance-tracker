import { Suspense } from "react"
import { RecentTransactions } from "./recent-transactions"
import { TransactionsTableSkeleton } from "./transactions-table-skeleton"
import type { Expense } from "@/types/expense"

interface RecentTransactionsSectionProps {
  expenses: Expense[]
}

export function RecentTransactionsSection({
  expenses,
}: RecentTransactionsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        <p className="text-sm text-gray-500">Your latest expense entries</p>
      </div>
      <div className="p-2">
        <Suspense fallback={<TransactionsTableSkeleton />}>
          <RecentTransactions expenses={expenses} />
        </Suspense>
      </div>
    </div>
  )
}

