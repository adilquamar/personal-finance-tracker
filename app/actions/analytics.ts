"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import { getDaysInRange, formatUrlDate } from "@/lib/utils/date-range"
import { DEFAULT_BUDGET } from "@/lib/constants/budget"
import type { Expense, ExpenseCategory } from "@/types/expense"

/**
 * Analytics summary data
 */
export interface AnalyticsSummary {
  /** Total amount spent in the date range */
  totalSpent: number
  /** Average daily spending */
  avgDaily: number
  /** Remaining budget (budget - spent) */
  remaining: number
  /** Percentage of budget used (0-100+) */
  budgetUsed: number
}

/**
 * Single data point for spending trend chart
 */
export interface SpendingTrendPoint {
  /** Date formatted as "yyyy-MM-dd" */
  date: string
  /** Total amount spent on this date */
  amount: number
}

/**
 * Category breakdown item
 */
export interface CategoryBreakdownItem {
  /** The expense category */
  category: ExpenseCategory
  /** Total amount spent in this category */
  amount: number
  /** Percentage of total spending (0-100) */
  percentage: number
}

/**
 * Gets expenses within a date range for the authenticated user.
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns Array of expenses in the date range
 */
export async function getExpensesByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Expense[]> {
  const user = await getUser()
  if (!user) {
    return []
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", formatUrlDate(startDate))
      .lte("date", formatUrlDate(endDate))
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching expenses by date range:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching expenses by date range:", error)
    return []
  }
}

/**
 * Gets analytics summary for a date range.
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @param budget - Optional budget amount (defaults to DEFAULT_BUDGET)
 * @returns Summary with totalSpent, avgDaily, remaining, and budgetUsed
 */
export async function getAnalyticsSummary(
  startDate: Date,
  endDate: Date,
  budget: number = DEFAULT_BUDGET
): Promise<AnalyticsSummary> {
  const expenses = await getExpensesByDateRange(startDate, endDate)

  // Calculate total spent using integer math to avoid floating-point issues
  // Amounts are stored in cents internally for precision
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate number of days in range
  const daysInRange = getDaysInRange(startDate, endDate).length

  // Calculate average daily spending (rounded to 2 decimal places)
  const avgDaily = daysInRange > 0 ? Math.round((totalSpent / daysInRange) * 100) / 100 : 0

  // Calculate remaining budget
  const remaining = Math.max(0, budget - totalSpent)

  // Calculate budget used percentage (can exceed 100%)
  const budgetUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0

  return {
    totalSpent,
    avgDaily,
    remaining,
    budgetUsed,
  }
}

/**
 * Gets spending trend data grouped by date.
 * Returns an array with one entry per day in the range, including days with no spending.
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns Array of { date, amount } for each day in the range
 */
export async function getSpendingTrend(
  startDate: Date,
  endDate: Date
): Promise<SpendingTrendPoint[]> {
  const expenses = await getExpensesByDateRange(startDate, endDate)

  // Create a map of date -> total amount
  const amountByDate = new Map<string, number>()

  // Sum expenses by date
  for (const expense of expenses) {
    const date = expense.date
    const currentAmount = amountByDate.get(date) || 0
    amountByDate.set(date, currentAmount + expense.amount)
  }

  // Generate data points for every day in range (including zero-spend days)
  const days = getDaysInRange(startDate, endDate)
  const trendData: SpendingTrendPoint[] = days.map((day) => {
    const dateStr = formatUrlDate(day)
    return {
      date: dateStr,
      amount: amountByDate.get(dateStr) || 0,
    }
  })

  return trendData
}

/**
 * Gets category breakdown with amounts and percentages.
 * Results are sorted by amount descending (highest spending first).
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns Array of { category, amount, percentage } sorted by amount descending
 */
export async function getCategoryBreakdown(
  startDate: Date,
  endDate: Date
): Promise<CategoryBreakdownItem[]> {
  const expenses = await getExpensesByDateRange(startDate, endDate)

  // Handle empty data
  if (expenses.length === 0) {
    return []
  }

  // Sum expenses by category
  const amountByCategory = new Map<ExpenseCategory, number>()
  let totalSpent = 0

  for (const expense of expenses) {
    const category = expense.category
    const currentAmount = amountByCategory.get(category) || 0
    amountByCategory.set(category, currentAmount + expense.amount)
    totalSpent += expense.amount
  }

  // Convert to array with percentages
  const breakdown: CategoryBreakdownItem[] = []

  amountByCategory.forEach((amount, category) => {
    // Calculate percentage rounded to nearest integer
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
    breakdown.push({
      category,
      amount,
      percentage,
    })
  })

  // Sort by amount descending
  breakdown.sort((a, b) => b.amount - a.amount)

  return breakdown
}

/**
 * Gets all analytics data for a date range in a single call.
 * More efficient than calling each function separately.
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @param budget - Optional budget amount (defaults to DEFAULT_BUDGET)
 * @returns Object containing summary, trend, and category breakdown
 */
export async function getAnalyticsData(
  startDate: Date,
  endDate: Date,
  budget: number = DEFAULT_BUDGET
): Promise<{
  summary: AnalyticsSummary
  trend: SpendingTrendPoint[]
  categories: CategoryBreakdownItem[]
}> {
  // Fetch expenses once and compute all analytics
  const expenses = await getExpensesByDateRange(startDate, endDate)
  const daysInRange = getDaysInRange(startDate, endDate)

  // Calculate summary
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const avgDaily = daysInRange.length > 0
    ? Math.round((totalSpent / daysInRange.length) * 100) / 100
    : 0
  const remaining = Math.max(0, budget - totalSpent)
  const budgetUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0

  // Calculate trend
  const amountByDate = new Map<string, number>()
  for (const expense of expenses) {
    const date = expense.date
    const currentAmount = amountByDate.get(date) || 0
    amountByDate.set(date, currentAmount + expense.amount)
  }

  const trend: SpendingTrendPoint[] = daysInRange.map((day) => {
    const dateStr = formatUrlDate(day)
    return {
      date: dateStr,
      amount: amountByDate.get(dateStr) || 0,
    }
  })

  // Calculate category breakdown
  const amountByCategory = new Map<ExpenseCategory, number>()
  for (const expense of expenses) {
    const category = expense.category
    const currentAmount = amountByCategory.get(category) || 0
    amountByCategory.set(category, currentAmount + expense.amount)
  }

  const categories: CategoryBreakdownItem[] = []
  amountByCategory.forEach((amount, category) => {
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
    categories.push({ category, amount, percentage })
  })
  categories.sort((a, b) => b.amount - a.amount)

  return {
    summary: { totalSpent, avgDaily, remaining, budgetUsed },
    trend,
    categories,
  }
}
