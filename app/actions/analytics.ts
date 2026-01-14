"use server"

import { withAuthQuery } from "@/lib/auth"
import { getDaysInRange, formatUrlDate } from "@/lib/utils/date-range"
import { DEFAULT_BUDGET } from "@/lib/constants/budget"
import type { Expense, ExpenseCategory } from "@/types/expense"
import type {
  AnalyticsSummary,
  SpendingTrendPoint,
  CategoryBreakdownItem,
  AnalyticsData,
  AnalyticsInput,
} from "@/types/analytics"

/**
 * Default/empty analytics data for unauthenticated users
 */
const EMPTY_ANALYTICS: AnalyticsData = {
  summary: { totalSpent: 0, avgDaily: 0, remaining: DEFAULT_BUDGET, budgetUsed: 0 },
  trend: [],
  categories: [],
}

// ============================================================================
// Pure Computation Functions (no auth, no DB - easy to test)
// ============================================================================

/**
 * Computes analytics summary from expenses
 */
function computeSummary(
  expenses: Expense[],
  daysCount: number,
  budget: number
): AnalyticsSummary {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const avgDaily = daysCount > 0
    ? Math.round((totalSpent / daysCount) * 100) / 100
    : 0
  const remaining = Math.max(0, budget - totalSpent)
  const budgetUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0

  return { totalSpent, avgDaily, remaining, budgetUsed }
}

/**
 * Computes spending trend from expenses
 */
function computeTrend(
  expenses: Expense[],
  days: Date[]
): SpendingTrendPoint[] {
  // Create a map of date -> total amount
  const amountByDate = new Map<string, number>()

  for (const expense of expenses) {
    const date = expense.date
    const currentAmount = amountByDate.get(date) || 0
    amountByDate.set(date, currentAmount + expense.amount)
  }

  // Generate data points for every day in range
  return days.map((day) => {
    const dateStr = formatUrlDate(day)
    return {
      date: dateStr,
      amount: amountByDate.get(dateStr) || 0,
    }
  })
}

/**
 * Computes category breakdown from expenses
 */
function computeCategoryBreakdown(expenses: Expense[]): CategoryBreakdownItem[] {
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
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
    breakdown.push({ category, amount, percentage })
  })

  // Sort by amount descending
  breakdown.sort((a, b) => b.amount - a.amount)

  return breakdown
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Gets all analytics data for a date range in a single efficient call.
 *
 * @param input - Object containing startDate, endDate, and optional budget
 * @returns Object containing summary, trend, and category breakdown
 *
 * @example
 * const { summary, trend, categories } = await getAnalyticsData({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 *   budget: 1000,
 * })
 */
export const getAnalyticsData = withAuthQuery<AnalyticsInput, AnalyticsData>(
  async ({ user, supabase }, { startDate, endDate, budget = DEFAULT_BUDGET }) => {
    try {
      // Fetch expenses for the date range
      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", formatUrlDate(startDate))
        .lte("date", formatUrlDate(endDate))
        .order("date", { ascending: true })

      if (error) {
        console.error("Error fetching analytics data:", error.message)
        return EMPTY_ANALYTICS
      }

      const expenseList = expenses || []
      const days = getDaysInRange(startDate, endDate)

      // Compute all analytics from the fetched data
      return {
        summary: computeSummary(expenseList, days.length, budget),
        trend: computeTrend(expenseList, days),
        categories: computeCategoryBreakdown(expenseList),
      }
    } catch (error) {
      console.error("Unexpected error fetching analytics data:", error)
      return EMPTY_ANALYTICS
    }
  },
  EMPTY_ANALYTICS
)
