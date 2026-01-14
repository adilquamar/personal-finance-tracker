import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ContentCard } from "@/components/ui/content-card"

/**
 * Page container skeleton - wraps page content with consistent padding
 */
interface PageSkeletonProps {
  children: React.ReactNode
  className?: string
}

export function PageSkeleton({ children, className }: PageSkeletonProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50 pt-16", className)}>
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}

/**
 * Page header skeleton - title and subtitle
 */
interface PageHeaderSkeletonProps {
  /** Show subtitle line */
  withSubtitle?: boolean
  className?: string
}

export function PageHeaderSkeleton({
  withSubtitle = true,
  className,
}: PageHeaderSkeletonProps) {
  return (
    <div className={cn("mb-8", className)}>
      <Skeleton className="h-9 w-72 mb-2" />
      {withSubtitle && <Skeleton className="h-5 w-80" />}
    </div>
  )
}

/**
 * Stats grid skeleton - grid of stat cards
 */
interface StatsGridSkeletonProps {
  /** Number of stat cards */
  count?: number
  className?: string
}

export function StatsGridSkeleton({
  count = 4,
  className,
}: StatsGridSkeletonProps) {
  return (
    <div
      className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", className)}
    >
      {[...Array(count)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Single stat card skeleton
 */
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <ContentCard padding="sm" className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </ContentCard>
  )
}

/**
 * Form skeleton - mimics a form with inputs
 */
interface FormSkeletonProps {
  /** Layout configuration: array of row configurations */
  layout?: Array<"single" | "double">
  /** Show submit button */
  withButton?: boolean
  /** Title at top of form */
  withTitle?: boolean
  className?: string
}

export function FormSkeleton({
  layout = ["double", "double", "single"],
  withButton = true,
  withTitle = true,
  className,
}: FormSkeletonProps) {
  return (
    <ContentCard className={className}>
      {withTitle && <Skeleton className="h-6 w-32 mb-6" />}
      <div className="space-y-4">
        {layout.map((row, i) =>
          row === "double" ? (
            <div key={i} className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ) : (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          )
        )}
        {withButton && (
          <Skeleton className="h-12 w-full rounded-lg bg-indigo-200" />
        )}
      </div>
    </ContentCard>
  )
}

/**
 * Quick actions grid skeleton
 */
interface QuickActionsSkeletonProps {
  /** Number of action cards */
  count?: number
  className?: string
}

export function QuickActionsSkeleton({
  count = 4,
  className,
}: QuickActionsSkeletonProps) {
  return (
    <ContentCard className={className}>
      <Skeleton className="h-6 w-28 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(count)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 rounded-xl"
          />
        ))}
      </div>
    </ContentCard>
  )
}

/**
 * Table skeleton - mimics a data table
 */
interface TableSkeletonProps {
  /** Number of rows */
  rows?: number
  /** Number of columns */
  columns?: number
  /** Show table header */
  withHeader?: boolean
  /** Show section title above table */
  withTitle?: boolean
  className?: string
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  withHeader = true,
  withTitle = true,
  className,
}: TableSkeletonProps) {
  return (
    <ContentCard padding="sm" className={cn("p-0", className)}>
      {withTitle && (
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-44" />
        </div>
      )}
      <div className="p-4 space-y-4">
        {/* Header skeleton */}
        {withHeader && (
          <div className="flex gap-4 px-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        )}
        {/* Row skeletons */}
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex gap-4 px-4 py-3 border-t border-gray-100"
          >
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </ContentCard>
  )
}

/**
 * Two-column layout skeleton
 */
interface TwoColumnSkeletonProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}

export function TwoColumnSkeleton({
  left,
  right,
  className,
}: TwoColumnSkeletonProps) {
  return (
    <div
      className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", className)}
    >
      {left}
      {right}
    </div>
  )
}

/**
 * List skeleton - for simple list layouts
 */
interface ListSkeletonProps {
  /** Number of items */
  items?: number
  /** Show icons/avatars */
  withIcon?: boolean
  className?: string
}

export function ListSkeleton({
  items = 5,
  withIcon = false,
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {withIcon && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Card skeleton - generic card placeholder
 */
interface CardSkeletonProps {
  /** Include header placeholder */
  withHeader?: boolean
  /** Number of content lines to show */
  lines?: number
  className?: string
  children?: React.ReactNode
}

export function CardSkeleton({
  withHeader = true,
  lines = 3,
  className,
  children,
}: CardSkeletonProps) {
  return (
    <ContentCard className={className}>
      {children ?? (
        <>
          {withHeader && <Skeleton className="h-6 w-32 mb-4" />}
          <div className="space-y-3">
            {[...Array(lines)].map((_, i) => (
              <Skeleton
                key={i}
                className={cn("h-4", i === lines - 1 ? "w-32" : "w-full")}
              />
            ))}
          </div>
        </>
      )}
    </ContentCard>
  )
}
