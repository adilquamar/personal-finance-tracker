import type { ExpenseCategory } from "./expense"

/**
 * Analytics summary statistics for a date range.
 * Contains key metrics like total spending, averages, and budget usage.
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
 * Single data point for spending trend chart.
 * Represents spending for a single day.
 */
export interface SpendingTrendPoint {
  /** Date formatted as "yyyy-MM-dd" */
  date: string
  /** Total amount spent on this date */
  amount: number
}

/**
 * Category breakdown item showing spending per category.
 * Includes the category, total amount, and percentage of total.
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
 * Complete analytics data for a date range.
 * Contains summary stats, trend data, and category breakdown.
 */
export interface AnalyticsData {
  /** Summary statistics (totals, averages) */
  summary: AnalyticsSummary
  /** Daily spending trend data points */
  trend: SpendingTrendPoint[]
  /** Category breakdown sorted by amount descending */
  categories: CategoryBreakdownItem[]
}

/**
 * Input parameters for analytics queries.
 * Used to filter analytics data by date range and budget.
 */
export interface AnalyticsInput {
  /** Start date of the range */
  startDate: Date
  /** End date of the range */
  endDate: Date
  /** Optional budget amount for calculations */
  budget?: number
}
