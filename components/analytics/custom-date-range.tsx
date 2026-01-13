"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"
import { isAfter, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import { formatUrlDate, parseUrlDate } from "@/lib/utils/date-range"
import { DateRangePicker } from "./date-range-picker"

interface CustomDateRangeProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * Custom date range picker for analytics.
 * Only renders when ?range=custom is in the URL.
 * Manages ?startDate= and ?endDate= URL search params.
 */
export function CustomDateRange({ className }: CustomDateRangeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Only render when range is "custom"
  const range = searchParams.get("range")
  const isCustomRange = range === "custom"

  // Parse dates from URL params
  const startDate = useMemo(
    () => parseUrlDate(searchParams.get("startDate")),
    [searchParams]
  )
  const endDate = useMemo(
    () => parseUrlDate(searchParams.get("endDate")),
    [searchParams]
  )

  // Update URL search params
  const updateDateParam = useCallback(
    (param: "startDate" | "endDate", date: Date | undefined) => {
      const params = new URLSearchParams(searchParams.toString())

      if (date) {
        params.set(param, formatUrlDate(date))
      } else {
        params.delete(param)
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  // Handle start date change with validation
  const handleStartDateChange = useCallback(
    (date: Date | undefined) => {
      if (date && endDate && isAfter(startOfDay(date), startOfDay(endDate))) {
        // If new start date is after end date, clear end date
        const params = new URLSearchParams(searchParams.toString())
        params.set("startDate", formatUrlDate(date))
        params.delete("endDate")
        router.push(`${pathname}?${params.toString()}`)
      } else {
        updateDateParam("startDate", date)
      }
    },
    [endDate, updateDateParam, searchParams, router, pathname]
  )

  // Handle end date change
  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      updateDateParam("endDate", date)
    },
    [updateDateParam]
  )

  // Don't render if not custom range
  if (!isCustomRange) {
    return null
  }

  return (
    <div
      className={cn(
        // Stack on mobile, side-by-side on larger screens
        "flex flex-col sm:flex-row gap-3",
        className
      )}
    >
      <DateRangePicker
        label="Start Date"
        placeholder="Select start date"
        value={startDate}
        onChange={handleStartDateChange}
      />

      <DateRangePicker
        label="End Date"
        placeholder="Select end date"
        value={endDate}
        onChange={handleEndDateChange}
        disabled={(date) =>
          // Disable dates before start date
          startDate ? date < startOfDay(startDate) : false
        }
      />
    </div>
  )
}
