import {
  PageSkeleton,
  PageHeaderSkeleton,
  StatsGridSkeleton,
  FormSkeleton,
  QuickActionsSkeleton,
  TableSkeleton,
  TwoColumnSkeleton,
} from "@/components/shared"

/**
 * Dashboard loading skeleton
 * Shown automatically by Next.js while the dashboard page is loading
 */
export default function DashboardLoading() {
  return (
    <PageSkeleton>
      {/* Welcome Section Skeleton */}
      <PageHeaderSkeleton />

      {/* Stats Grid Skeleton */}
      <StatsGridSkeleton count={4} />

      {/* Two Column Layout Skeleton */}
      <TwoColumnSkeleton
        left={<FormSkeleton layout={["double", "double"]} />}
        right={<QuickActionsSkeleton count={4} />}
      />

      {/* Recent Transactions Skeleton */}
      <TableSkeleton rows={5} columns={4} />
    </PageSkeleton>
  )
}
