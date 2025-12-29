/**
 * Loading skeleton for the transactions table
 */
export function TransactionsTableSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Header skeleton */}
      <div className="flex gap-4 px-4">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
      </div>
      {/* Row skeletons */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-t border-gray-100">
          <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse ml-auto" />
        </div>
      ))}
    </div>
  )
}

