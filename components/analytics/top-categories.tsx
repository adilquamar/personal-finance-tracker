import { formatCurrency } from "@/lib/utils/format"
import { EXPENSE_CATEGORY_LABELS } from "@/types/expense"
import { ContentCard } from "@/components/ui/content-card"
import type { CategoryBreakdownItem } from "@/types/analytics"

interface TopCategoriesProps {
  /** Array of category breakdown items sorted by amount descending */
  categories: CategoryBreakdownItem[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Single category row with name, amount, and progress bar
 */
function CategoryRow({
  item,
  maxAmount,
}: {
  item: CategoryBreakdownItem
  maxAmount: number
}) {
  // Calculate progress bar width as percentage of highest category
  const progressWidth = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {EXPENSE_CATEGORY_LABELS[item.category]}
        </span>
        <span className="text-sm text-gray-600">
          {formatCurrency(item.amount)}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Top categories breakdown showing ranked list with progress bars.
 * Categories are displayed with their amounts and visual progress bars
 * relative to the highest spending category.
 */
export function TopCategories({ categories, className }: TopCategoriesProps) {
  // Handle empty state
  if (!categories || categories.length === 0) {
    return (
      <ContentCard className={className}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Categories
        </h3>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">No expenses yet</p>
        </div>
      </ContentCard>
    )
  }

  // Get the max amount for progress bar calculation (first item since sorted desc)
  const maxAmount = categories[0]?.amount || 0

  return (
    <ContentCard className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Categories</h3>
      <div className="space-y-4">
        {categories.map((item) => (
          <CategoryRow
            key={item.category}
            item={item}
            maxAmount={maxAmount}
          />
        ))}
      </div>
    </ContentCard>
  )
}
