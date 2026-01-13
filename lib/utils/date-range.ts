import {
  subDays,
  startOfDay,
  endOfDay,
  parseISO,
  format,
  eachDayOfInterval,
  isValid,
} from "date-fns"
import type { TimeRange } from "@/components/analytics/time-range-selector"

/**
 * Result of date range calculation
 */
export interface DateRangeResult {
  startDate: Date
  endDate: Date
}

/**
 * Calculates the date range based on the selected time range and optional custom dates.
 *
 * @param range - The time range type: 'week', 'month', 'year', or 'custom'
 * @param customStartDate - Optional start date string (yyyy-MM-dd) for custom range
 * @param customEndDate - Optional end date string (yyyy-MM-dd) for custom range
 * @returns Object with startDate and endDate as Date objects
 *
 * @example
 * // Get last 7 days
 * getDateRangeFromParams('week')
 *
 * @example
 * // Get custom date range
 * getDateRangeFromParams('custom', '2024-01-01', '2024-01-31')
 */
export function getDateRangeFromParams(
  range: TimeRange | null,
  customStartDate?: string | null,
  customEndDate?: string | null
): DateRangeResult {
  const today = new Date()
  const todayEnd = endOfDay(today)

  switch (range) {
    case "week":
      // Last 7 days including today
      return {
        startDate: startOfDay(subDays(today, 6)),
        endDate: todayEnd,
      }

    case "year":
      // Last 365 days including today
      return {
        startDate: startOfDay(subDays(today, 364)),
        endDate: todayEnd,
      }

    case "custom":
      // Use provided custom dates, fallback to last 30 days if invalid
      const parsedStart = customStartDate ? parseISO(customStartDate) : null
      const parsedEnd = customEndDate ? parseISO(customEndDate) : null

      const validStart = parsedStart && isValid(parsedStart) ? parsedStart : null
      const validEnd = parsedEnd && isValid(parsedEnd) ? parsedEnd : null

      if (validStart && validEnd) {
        return {
          startDate: startOfDay(validStart),
          endDate: endOfDay(validEnd),
        }
      } else if (validStart) {
        // Only start date provided, use today as end
        return {
          startDate: startOfDay(validStart),
          endDate: todayEnd,
        }
      } else if (validEnd) {
        // Only end date provided, use 30 days before as start
        return {
          startDate: startOfDay(subDays(validEnd, 29)),
          endDate: endOfDay(validEnd),
        }
      }
      // No valid dates, fallback to month
      return {
        startDate: startOfDay(subDays(today, 29)),
        endDate: todayEnd,
      }

    case "month":
    default:
      // Last 30 days including today (default)
      return {
        startDate: startOfDay(subDays(today, 29)),
        endDate: todayEnd,
      }
  }
}

/**
 * Formats a date for chart x-axis labels.
 *
 * @param date - The date to format
 * @returns Formatted string like "Dec 12"
 *
 * @example
 * formatDateLabel(new Date('2024-12-12'))
 * // Returns "Dec 12"
 */
export function formatDateLabel(date: Date): string {
  return format(date, "MMM d")
}

/**
 * Gets an array of all dates in the given range (inclusive).
 * Useful for generating chart data points for each day.
 *
 * @param startDate - The start of the range
 * @param endDate - The end of the range
 * @returns Array of Date objects, one for each day in the range
 *
 * @example
 * getDaysInRange(new Date('2024-01-01'), new Date('2024-01-03'))
 * // Returns [Date(2024-01-01), Date(2024-01-02), Date(2024-01-03)]
 */
export function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  return eachDayOfInterval({
    start: startOfDay(startDate),
    end: startOfDay(endDate),
  })
}

/**
 * Formats a date for URL storage as "yyyy-MM-dd"
 *
 * @param date - The date to format
 * @returns Formatted string like "2024-12-12"
 */
export function formatUrlDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/**
 * Safely parses a date string from URL params
 *
 * @param dateString - The date string to parse (yyyy-MM-dd format)
 * @returns Parsed Date object or undefined if invalid
 */
export function parseUrlDate(dateString: string | null): Date | undefined {
  if (!dateString) return undefined
  try {
    const parsed = parseISO(dateString)
    if (!isValid(parsed)) return undefined
    return parsed
  } catch {
    return undefined
  }
}

/**
 * Gets the number of days in a date range (inclusive)
 *
 * @param startDate - The start of the range
 * @param endDate - The end of the range
 * @returns Number of days in the range
 */
export function getDaysCount(startDate: Date, endDate: Date): number {
  return getDaysInRange(startDate, endDate).length
}
