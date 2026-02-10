import type { ExpenseCategory } from './expense'

/**
 * Budget period enum matching the PostgreSQL budget_period type.
 * Extensible: add 'weekly' later.
 */
export type BudgetPeriod = 'monthly' | 'yearly'

/**
 * Array of all budget periods for iteration/validation
 */
export const BUDGET_PERIODS: BudgetPeriod[] = ['monthly', 'yearly']

/**
 * Display labels for budget periods
 */
export const BUDGET_PERIOD_LABELS: Record<BudgetPeriod, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
}

/**
 * Budget record matching the database schema
 */
export interface Budget {
  id: string
  user_id: string
  category: ExpenseCategory
  period: BudgetPeriod
  amount: number
  created_at: string
  updated_at: string
}

/**
 * Data required to create a new budget
 */
export interface CreateBudgetInput {
  category: ExpenseCategory
  period: BudgetPeriod
  amount: number
}

/**
 * Data for updating an existing budget
 */
export interface UpdateBudgetInput {
  category?: ExpenseCategory
  period?: BudgetPeriod
  amount?: number
}

/**
 * Enriched budget type with computed spending data
 */
export interface BudgetWithSpending extends Budget {
  /** Amount spent in the current period */
  spent: number
  /** Remaining budget (budget - spent) */
  remaining: number
  /** Percentage of budget used (0–100+) */
  percentUsed: number
  /** Whether spending has exceeded the budget */
  isExceeded: boolean
}

/**
 * Overall budget snapshot for a given month.
 * Used for the top-of-page summary cards.
 */
export interface BudgetSnapshot {
  /** The month this snapshot covers (ISO date string, first of the month) */
  month: string
  /** Total budgeted amount across all monthly categories */
  totalBudget: number
  /** Total spent amount across all monthly categories */
  totalSpent: number
  /** Difference: totalBudget - totalSpent (positive = under budget) */
  difference: number
}

/**
 * Per-category, per-month result for the monthly breakdown view.
 * Shows dollar amount saved (positive) or exceeded (negative) for each month
 * of the current year.
 */
export interface MonthlyBudgetResult {
  /** The expense category */
  category: ExpenseCategory
  /** Monthly budget amount for this category */
  budgetAmount: number
  /** Per-month breakdown: key is month number (1-12), value is budget - spent */
  months: Record<number, number>
  /** Total saved/exceeded across all months so far this year */
  totalDifference: number
}
