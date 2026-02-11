import {
  PageSkeleton,
  PageHeaderSkeleton,
  StatsGridSkeleton,
  TableSkeleton,
} from "@/components/shared"

export default function Loading() {
  return (
    <PageSkeleton>
      <PageHeaderSkeleton />
      <StatsGridSkeleton count={4} />
      <TableSkeleton rows={5} columns={4} />
    </PageSkeleton>
  )
}
