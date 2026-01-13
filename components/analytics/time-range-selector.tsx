"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

/**
 * Time range options for analytics filtering
 */
export type TimeRange = "week" | "month" | "year" | "custom"

/**
 * Array of all time range options for iteration
 */
export const TIME_RANGES: TimeRange[] = ["week", "month", "year", "custom"]

/**
 * Display labels for time range options
 */
export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  week: "Week",
  month: "Month",
  year: "Year",
  custom: "Custom",
}

interface TimeRangeSelectorProps {
  /** Default time range when no URL param is present */
  defaultRange?: TimeRange
  /** Additional CSS classes */
  className?: string
}

/**
 * Time range selector with URL search param state management.
 * Updates the URL with ?range=week|month|year|custom on selection.
 */
export function TimeRangeSelector({
  defaultRange = "month",
  className,
}: TimeRangeSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get current range from URL params or use default
  const currentRange = (searchParams.get("range") as TimeRange) || defaultRange

  // Update URL search params when range changes
  const handleRangeChange = useCallback(
    (range: TimeRange) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("range", range)

      // Clear custom date params when switching away from custom
      if (range !== "custom") {
        params.delete("startDate")
        params.delete("endDate")
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div
      className={cn("grid grid-cols-4 gap-2", className)}
      role="group"
      aria-label="Select time range"
    >
      {TIME_RANGES.map((range) => {
        const isActive = currentRange === range

        return (
          <button
            key={range}
            type="button"
            onClick={() => handleRangeChange(range)}
            className={cn(
              // Base styles
              "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              // Focus styles
              "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
              // Responsive: smaller padding on mobile
              "sm:px-4 sm:py-2.5",
              // Active vs inactive styles
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            aria-pressed={isActive}
          >
            {TIME_RANGE_LABELS[range]}
          </button>
        )
      })}
    </div>
  )
}
