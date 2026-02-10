"use server"

import { revalidatePath } from "next/cache"
import {
  withAuth,
  withAuthQueryNoInput,
} from "@/lib/auth"
import { budgetSchema, type BudgetFormData } from "@/lib/validations/budget"
import type {
  Budget,
  BudgetWithSpending,
  BudgetSnapshot,
  MonthlyBudgetResult,
} from "@/types/budget"
import type { Expense } from "@/types/expense"


/**
 * All data needed for the budget page, computed server-side for efficiency.
 */
interface BudgetPageData {
  /** Budgets enriched with current-period spending data */
  budgets: BudgetWithSpending[]
  /** Snapshot for the current (in-progress) month */
  currentMonthSnapshot: BudgetSnapshot
  /** Snapshot for the last completed month */
  lastMonthSnapshot: BudgetSnapshot
  /** Per-category, per-month breakdown for the current year (monthly budgets only) */
  monthlyBreakdown: MonthlyBudgetResult[]
}

/**
 * Input for deleteBudget action
 */
interface DeleteBudgetInput {
  id: string
}


const EMPTY_SNAPSHOT: BudgetSnapshot = {
  month: new Date().toISOString(),
  totalBudget: 0,
  totalSpent: 0,
  difference: 0,
}

const EMPTY_PAGE_DATA: BudgetPageData = {
  budgets: [],
  currentMonthSnapshot: EMPTY_SNAPSHOT,
  lastMonthSnapshot: EMPTY_SNAPSHOT,
  monthlyBreakdown: [],
}

/**
 * Formats year/month/day as a YYYY-MM-DD string.
 */
function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/**
 * Returns the last day of the given month (1-indexed).
 */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/**
 * Filters expenses to those within a date range [startDate, endDate] (inclusive).
 */
function filterExpensesByDateRange(
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] {
  return expenses.filter((e) => e.date >= startDate && e.date <= endDate)
}

/**
 * Sums expense amounts for a specific category.
 */
function sumByCategory(expenses: Expense[], category: string): number {
  return expenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0)
}

/**
 * Rounds a number to 2 decimal places (avoids floating-point drift).
 */
function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/**
 * Computes BudgetWithSpending for each budget using the relevant period's expenses.
 *
 * - Monthly budgets → current calendar month spending
 * - Yearly budgets  → current calendar year spending
 */
function computeBudgetsWithSpending(
  budgets: Budget[],
  expenses: Expense[],
  now: Date
): BudgetWithSpending[] {
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-indexed

  return budgets.map((budget) => {
    let spent: number

    if (budget.period === "monthly") {
      const monthStart = formatDate(currentYear, currentMonth, 1)
      const monthEnd = formatDate(
        currentYear,
        currentMonth,
        lastDayOfMonth(currentYear, currentMonth)
      )
      const monthExpenses = filterExpensesByDateRange(expenses, monthStart, monthEnd)
      spent = sumByCategory(monthExpenses, budget.category)
    } else {
      // yearly
      const yearStart = formatDate(currentYear, 1, 1)
      const yearEnd = formatDate(currentYear, 12, 31)
      const yearExpenses = filterExpensesByDateRange(expenses, yearStart, yearEnd)
      spent = sumByCategory(yearExpenses, budget.category)
    }

    const remaining = round2(budget.amount - spent)
    const percentUsed =
      budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0
    const isExceeded = spent > budget.amount

    return {
      ...budget,
      spent: round2(spent),
      remaining,
      percentUsed,
      isExceeded,
    }
  })
}

/**
 * Computes a BudgetSnapshot for a given month by summing all monthly budgets
 * vs. actual spending in those categories for the month.
 */
function computeSnapshot(
  monthlyBudgets: Budget[],
  expenses: Expense[],
  year: number,
  month: number // 1-indexed
): BudgetSnapshot {
  const monthStart = formatDate(year, month, 1)
  const monthEnd = formatDate(year, month, lastDayOfMonth(year, month))
  const monthExpenses = filterExpensesByDateRange(expenses, monthStart, monthEnd)

  const totalBudget = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = monthlyBudgets.reduce(
    (sum, b) => sum + sumByCategory(monthExpenses, b.category),
    0
  )

  return {
    month: monthStart,
    totalBudget: round2(totalBudget),
    totalSpent: round2(totalSpent),
    difference: round2(totalBudget - totalSpent),
  }
}

/**
 * For each monthly-budgeted category, computes the dollar amount saved (positive)
 * or exceeded (negative) per month of the current year through the current month.
 */
function computeMonthlyBreakdown(
  monthlyBudgets: Budget[],
  expenses: Expense[],
  now: Date
): MonthlyBudgetResult[] {
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-indexed

  return monthlyBudgets.map((budget) => {
    const months: Record<number, number> = {}
    let totalDifference = 0

    for (let month = 1; month <= currentMonth; month++) {
      const monthStart = formatDate(currentYear, month, 1)
      const monthEnd = formatDate(
        currentYear,
        month,
        lastDayOfMonth(currentYear, month)
      )
      const monthExpenses = filterExpensesByDateRange(expenses, monthStart, monthEnd)
      const spent = sumByCategory(monthExpenses, budget.category)
      const difference = round2(budget.amount - spent)
      months[month] = difference
      totalDifference += difference
    }

    return {
      category: budget.category,
      budgetAmount: budget.amount,
      months,
      totalDifference: round2(totalDifference),
    }
  })
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Creates or updates a budget for the authenticated user.
 * Uses upsert on the (user_id, category, period) unique constraint.
 *
 * @param formData - The budget form data (category, period, amount)
 * @returns Success with the upserted budget or error message
 */
export const upsertBudget = withAuth<BudgetFormData, Budget>(
  async ({ user, supabase }, formData) => {
    // Validate form data
    const validationResult = budgetSchema.safeParse(formData)
    if (!validationResult.success) {
      return {
        success: false,
        error:
          validationResult.error.errors[0]?.message || "Invalid budget data",
      }
    }

    const { category, period, amount } = validationResult.data

    try {
      const { data, error } = await supabase
        .from("budgets")
        .upsert(
          {
            user_id: user.id,
            category,
            period,
            amount,
          },
          { onConflict: "user_id,category,period" }
        )
        .select()
        .single()

      if (error) {
        console.error("Error upserting budget:", error.message)
        return {
          success: false,
          error: "Failed to save budget. Please try again.",
        }
      }

      // Revalidate all pages so any route displaying budget data gets fresh results
      revalidatePath("/", "layout")

      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error upserting budget:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  },
  { errorMessage: "You must be logged in to manage budgets" }
)

/**
 * Deletes a budget by ID for the authenticated user.
 *
 * @param input - Object containing the budget ID to delete
 * @returns Success or error message
 */
export const deleteBudget = withAuth<DeleteBudgetInput, void>(
  async ({ user, supabase }, { id }) => {
    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting budget:", error.message)
        return {
          success: false,
          error: "Failed to delete budget. Please try again.",
        }
      }

      revalidatePath("/", "layout")

      return { success: true }
    } catch (error) {
      console.error("Unexpected error deleting budget:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  },
  { errorMessage: "You must be logged in to delete budgets" }
)

/**
 * Gets all data needed for the budget page in a single efficient call.
 *
 * Fetches budgets and all current-year expenses in two parallel queries,
 * then computes everything in-memory:
 * - BudgetWithSpending for each budget (spent, remaining, percentUsed, isExceeded)
 * - BudgetSnapshot for current month and last completed month
 * - MonthlyBudgetResult breakdown for each monthly-budgeted category
 *
 * @returns Complete BudgetPageData object
 */
export const getBudgetPageData = withAuthQueryNoInput<BudgetPageData>(
  async ({ user, supabase }) => {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1 // 1-indexed

      // Previous month: handle January → December of the prior year
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear

      // Determine the expense query range.
      // We always need current-year expenses. If we're in January we also
      // need December of last year for the "last month" snapshot.
      const expensesStart = formatDate(
        currentMonth === 1 ? prevYear : currentYear,
        currentMonth === 1 ? 12 : 1,
        1
      )
      const expensesEnd = formatDate(currentYear, 12, 31)

      // Fetch budgets and expenses in parallel for efficiency
      const [budgetsRes, expensesRes] = await Promise.all([
        supabase
          .from("budgets")
          .select("*")
          .eq("user_id", user.id)
          .order("category", { ascending: true })
          .order("period", { ascending: true }),
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", expensesStart)
          .lte("date", expensesEnd)
          .order("date", { ascending: true }),
      ])

      if (budgetsRes.error) {
        console.error("Error fetching budgets:", budgetsRes.error.message)
        return EMPTY_PAGE_DATA
      }

      if (expensesRes.error) {
        console.error("Error fetching expenses:", expensesRes.error.message)
        return EMPTY_PAGE_DATA
      }

      const budgets: Budget[] = budgetsRes.data || []
      const expenses: Expense[] = expensesRes.data || []

      // If there are no budgets, return empty data early
      if (budgets.length === 0) {
        return EMPTY_PAGE_DATA
      }

      const monthlyBudgets = budgets.filter((b) => b.period === "monthly")

      // Compute enriched budgets with spending for the current period
      const budgetsWithSpending = computeBudgetsWithSpending(
        budgets,
        expenses,
        now
      )

      // Compute snapshots for the current and last completed month
      const currentMonthSnapshot = computeSnapshot(
        monthlyBudgets,
        expenses,
        currentYear,
        currentMonth
      )
      const lastMonthSnapshot = computeSnapshot(
        monthlyBudgets,
        expenses,
        prevYear,
        prevMonth
      )

      // Compute per-month breakdown for the current year (monthly budgets only)
      const monthlyBreakdown = computeMonthlyBreakdown(
        monthlyBudgets,
        expenses,
        now
      )

      return {
        budgets: budgetsWithSpending,
        currentMonthSnapshot,
        lastMonthSnapshot,
        monthlyBreakdown,
      }
    } catch (error) {
      console.error("Unexpected error fetching budget page data:", error)
      return EMPTY_PAGE_DATA
    }
  },
  EMPTY_PAGE_DATA // Fallback for unauthenticated users
)
