import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/format"
import { ContentCard } from "@/components/ui/content-card"

interface TransactionsTotalBannerProps {
  /** Total amount spent in the current date range */
  total: number
  /** Number of transactions in the current date range */
  count: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Banner card showing the total spending amount and transaction count
 * for the currently selected date range.
 */
export function TransactionsTotalBanner({
  total,
  count,
  className,
}: TransactionsTotalBannerProps) {
  return (
    <ContentCard className={cn("flex items-center justify-between", className)}>
      <div>
        <p className="text-sm text-gray-500 mb-1">Total Spent</p>
        <p className="text-2xl font-medium text-gray-900">
          {formatCurrency(total)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500 mb-1">Transactions</p>
        <p className="text-2xl font-medium text-gray-900">{count}</p>
      </div>
    </ContentCard>
  )
}
