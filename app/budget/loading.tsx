import {
  PageSkeleton,
  PageHeaderSkeleton,
  StatsGridSkeleton,
  CardSkeleton,
  TableSkeleton,
} from "@/components/shared"

/**
 * Budget page loading skeleton.
 * Mirrors the page layout: header → snapshot cards → monthly breakdown → table.
 */
export default function BudgetLoading() {
  return (
    <PageSkeleton>
      {/* Page Header */}
      <PageHeaderSkeleton />

      {/* Snapshot Cards (2 side-by-side) */}
      <StatsGridSkeleton count={2} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" />

      {/* Monthly Breakdown Card */}
      <div className="mb-8">
        <CardSkeleton lines={5} />
      </div>

      {/* Budget Table */}
      <TableSkeleton rows={4} columns={7} />
    </PageSkeleton>
  )
}
