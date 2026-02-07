import { format } from "date-fns"
import { Receipt } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  EXPENSE_CATEGORY_LABELS,
  type Expense,
  type ExpenseCategory,
} from "@/types/expense"
import { cn } from "@/lib/utils"
import { ContentCard } from "@/components/ui/content-card"

interface TransactionsListProps {
  /** Array of expense transactions to display */
  expenses: Expense[]
}

/**
 * Color mapping for expense categories
 */
const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; text: string }> = {
  food: { bg: "bg-orange-50", text: "text-orange-600" },
  transportation: { bg: "bg-blue-50", text: "text-blue-600" },
  entertainment: { bg: "bg-purple-50", text: "text-purple-600" },
  shopping: { bg: "bg-pink-50", text: "text-pink-600" },
  bills: { bg: "bg-red-50", text: "text-red-600" },
  healthcare: { bg: "bg-green-50", text: "text-green-600" },
  other: { bg: "bg-gray-50", text: "text-gray-600" },
}

/**
 * Formats a number as USD currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Formats a date string with the year included (e.g., "Dec 28, 2024")
 * since date ranges can span multiple months/years.
 */
function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy")
}

/**
 * Category badge component
 */
function CategoryBadge({ category }: { category: ExpenseCategory }) {
  const colors = CATEGORY_COLORS[category]
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        colors.bg,
        colors.text
      )}
    >
      {EXPENSE_CATEGORY_LABELS[category]}
    </span>
  )
}

/**
 * Empty state component when no transactions exist in the selected range
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Receipt className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No transactions found
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-sm">
        No expenses were recorded in the selected date range. Try adjusting the
        time period or add a new expense.
      </p>
    </div>
  )
}

/**
 * Table component displaying transactions for a date range.
 * Shows date (with year), title, category (as badge), and amount columns.
 * Adapted from RecentTransactions with year-inclusive date formatting.
 */
export function TransactionsList({ expenses }: TransactionsListProps) {
  if (expenses.length === 0) {
    return (
      <ContentCard>
        <EmptyState />
      </ContentCard>
    )
  }

  return (
    <ContentCard padding="sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-gray-500 font-medium">Date</TableHead>
            <TableHead className="text-gray-500 font-medium">Title</TableHead>
            <TableHead className="text-gray-500 font-medium">Category</TableHead>
            <TableHead className="text-gray-500 font-medium text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-gray-50">
              <TableCell className="text-gray-900 font-medium">
                {formatDate(expense.date)}
              </TableCell>
              <TableCell className="text-gray-700">
                {expense.title || (
                  <span className="text-gray-400 italic">No title</span>
                )}
              </TableCell>
              <TableCell>
                <CategoryBadge category={expense.category} />
              </TableCell>
              <TableCell className="text-right text-gray-900 font-medium tabular-nums">
                {formatCurrency(expense.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ContentCard>
  )
}
