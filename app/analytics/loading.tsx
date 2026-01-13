import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-36 mb-2" />
          <Skeleton className="h-5 w-56" />
        </div>

        {/* Time Range Selector Skeleton */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>

        {/* Summary Stats Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-28" />
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Chart Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>

          {/* Top Categories Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
