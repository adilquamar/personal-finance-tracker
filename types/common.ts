/**
 * Common types used across the application
 */

/**
 * Standard result type for server actions (mutations).
 * Used by withAuth wrapper and all mutation actions.
 *
 * @example
 * // Success with data
 * return { success: true, data: expense }
 *
 * @example
 * // Success without data
 * return { success: true }
 *
 * @example
 * // Error
 * return { success: false, error: "Failed to create expense" }
 */
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

/**
 * Date range for queries and filters.
 * Used across analytics and reporting features.
 */
export interface DateRange {
  /** Start date of the range (inclusive) */
  startDate: Date
  /** End date of the range (inclusive) */
  endDate: Date
}
