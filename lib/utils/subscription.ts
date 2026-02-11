import type { Subscription, SubscriptionRecurrence } from "@/types/subscription"
import { getOrdinal } from "./format"

/**
 * Returns the number of days in a given month.
 * @param year  Full year (e.g. 2026)
 * @param month 1-indexed month (1 = January, 12 = December)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Formats year / 0-indexed month / day as YYYY-MM-DD.
 */
export function toDateString(
  year: number,
  month0: number,
  day: number
): string {
  const m = String(month0 + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

/**
 * Determines whether a subscription is "paid" or "upcoming" for the current
 * billing period.
 *
 * - Monthly: paid if today's date >= billing day (clamped to month length)
 * - Yearly:  paid if today is on or after the billing month+day this year
 */
export function computeStatus(
  subscription: Subscription,
  today: Date
): "paid" | "upcoming" {
  const anchor = new Date(subscription.billing_anchor_date + "T00:00:00")
  const billingDay = anchor.getDate()
  const billingMonth = anchor.getMonth() // 0-indexed

  if (subscription.recurrence === "monthly") {
    const maxDay = getDaysInMonth(today.getFullYear(), today.getMonth() + 1)
    const effectiveDay = Math.min(billingDay, maxDay)
    return today.getDate() >= effectiveDay ? "paid" : "upcoming"
  }

  // Yearly
  const year = today.getFullYear()
  const maxDay = getDaysInMonth(year, billingMonth + 1)
  const effectiveDay = Math.min(billingDay, maxDay)
  const billingDateThisYear = new Date(year, billingMonth, effectiveDay)

  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  return todayDateOnly >= billingDateThisYear ? "paid" : "upcoming"
}

/**
 * Computes the next billing date for a subscription.
 *
 * - Monthly paid    → next month's billing day
 * - Monthly upcoming → this month's billing day
 * - Yearly paid     → next year's billing month+day
 * - Yearly upcoming  → this year's billing month+day
 */
export function computeNextBillingDate(
  subscription: Subscription,
  today: Date,
  status: "paid" | "upcoming"
): string {
  const anchor = new Date(subscription.billing_anchor_date + "T00:00:00")
  const billingDay = anchor.getDate()
  const billingMonth = anchor.getMonth()
  const currentYear = today.getFullYear()

  if (subscription.recurrence === "monthly") {
    if (status === "paid") {
      // Next month
      let nextMonth = today.getMonth() + 1
      let nextYear = currentYear
      if (nextMonth > 11) {
        nextMonth = 0
        nextYear += 1
      }
      const maxDay = getDaysInMonth(nextYear, nextMonth + 1)
      return toDateString(nextYear, nextMonth, Math.min(billingDay, maxDay))
    }
    // Upcoming – this month
    const maxDay = getDaysInMonth(currentYear, today.getMonth() + 1)
    return toDateString(
      currentYear,
      today.getMonth(),
      Math.min(billingDay, maxDay)
    )
  }

  // Yearly
  if (status === "paid") {
    const nextYear = currentYear + 1
    const maxDay = getDaysInMonth(nextYear, billingMonth + 1)
    return toDateString(nextYear, billingMonth, Math.min(billingDay, maxDay))
  }
  // Upcoming – this year
  const maxDay = getDaysInMonth(currentYear, billingMonth + 1)
  return toDateString(currentYear, billingMonth, Math.min(billingDay, maxDay))
}

/**
 * Returns a human-readable billing schedule label.
 *
 * - Monthly: "Every 15th"
 * - Yearly:  "Every Jun 15"
 */
export function getBillingDateText(
  billingAnchorDate: string,
  recurrence: SubscriptionRecurrence
): string {
  const date = new Date(billingAnchorDate + "T00:00:00")
  const day = date.getDate()

  if (recurrence === "monthly") {
    return `Every ${getOrdinal(day)}`
  }

  const month = date.toLocaleString("en-US", { month: "short" })
  return `Every ${month} ${day}`
}

/**
 * Creates a stable reference Date from a day-of-month number.
 * Uses January 2024 as the anchor month (31 days) so all days 1-31 are valid.
 */
export function dateFromDay(day: number): Date {
  return new Date(2024, 0, day)
}

/**
 * Extracts the day-of-month number from a billing_anchor_date string (YYYY-MM-DD).
 */
export function getDayFromAnchor(anchorDate: string): number {
  return new Date(anchorDate + "T00:00:00").getDate()
}

/**
 * Parses a billing_anchor_date string (YYYY-MM-DD) into a Date object.
 */
export function getDateFromAnchor(anchorDate: string): Date {
  return new Date(anchorDate + "T00:00:00")
}
