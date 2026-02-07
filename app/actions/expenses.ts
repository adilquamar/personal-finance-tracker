"use server"

import { revalidatePath } from "next/cache"
import {
  withAuth,
  withAuthQuery,
  withAuthQueryNoInput,
} from "@/lib/auth"
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense"
import { formatUrlDate } from "@/lib/utils/date-range"
import type { Expense, ExpenseCategory } from "@/types/expense"
import type { ActionResult } from "@/types/common"
import type { MonthlyComparisonPoint } from "@/types/analytics"

/**
 * Result type for expense actions (re-exported for consumers)
 */
export type ExpenseActionResult = ActionResult<Expense>

/**
 * Adds a new expense for the authenticated user.
 *
 * @param formData - The expense form data
 * @returns Success with the created expense or error message
 */
export const addExpense = withAuth<ExpenseFormData, Expense>(
  async ({ user, supabase }, formData) => {
    // Validate form data
    const validationResult = expenseSchema.safeParse(formData)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid expense data",
      }
    }

    const { amount, category, date, title } = validationResult.data

    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          amount,
          category,
          date: formatUrlDate(date), // Format as YYYY-MM-DD in local timezone
          title,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding expense:", error.message)
        return { success: false, error: "Failed to add expense. Please try again." }
      }

      // Revalidate all pages so any route displaying expense data gets fresh results
      revalidatePath("/", "layout")

      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error adding expense:", error)
      return { success: false, error: "An unexpected error occurred. Please try again." }
    }
  },
  { errorMessage: "You must be logged in to add an expense" }
)

/**
 * Gets recent expenses for the authenticated user from the past N days.
 *
 * @param days - Number of days to look back
 * @returns Array of recent expenses ordered by date descending
 */
export const getRecentExpenses = withAuthQuery<number, Expense[]>(
  async ({ user, supabase }, days) => {
    try {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      const cutoffDate = cutoff.toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", cutoffDate)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching expenses:", error.message)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching expenses:", error)
      return []
    }
  },
  [] // Fallback for unauthenticated users
)

/**
 * Gets cumulative monthly spending comparison data for the current and previous month.
 *
 * @returns Array of data points with cumulative spending per day for both months
 */
export const getMonthlySpendingComparison = withAuthQueryNoInput<MonthlyComparisonPoint[]>(
  async ({ user, supabase }) => {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() // 0-indexed
      const today = now.getDate()

      // Current month range
      const currentMonthStart = new Date(currentYear, currentMonth, 1)
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0) // last day of current month
      const daysInCurrentMonth = currentMonthEnd.getDate()

      // Previous month range
      const prevMonthStart = new Date(currentYear, currentMonth - 1, 1)
      const prevMonthEnd = new Date(currentYear, currentMonth, 0) // last day of previous month
      const daysInPrevMonth = prevMonthEnd.getDate()

      const formatDate = (d: Date) => d.toISOString().split("T")[0]

      // Fetch expenses for both months in parallel
      const [currentRes, prevRes] = await Promise.all([
        supabase
          .from("expenses")
          .select("date, amount")
          .eq("user_id", user.id)
          .gte("date", formatDate(currentMonthStart))
          .lte("date", formatDate(currentMonthEnd)),
        supabase
          .from("expenses")
          .select("date, amount")
          .eq("user_id", user.id)
          .gte("date", formatDate(prevMonthStart))
          .lte("date", formatDate(prevMonthEnd)),
      ])

      if (currentRes.error || prevRes.error) {
        console.error("Error fetching monthly comparison:", currentRes.error?.message || prevRes.error?.message)
        return []
      }

      // Aggregate daily spending for current month
      const currentDailyMap: Record<number, number> = {}
      for (const row of currentRes.data || []) {
        const day = new Date(row.date + "T00:00:00").getDate()
        currentDailyMap[day] = (currentDailyMap[day] || 0) + row.amount
      }

      // Aggregate daily spending for previous month
      const prevDailyMap: Record<number, number> = {}
      for (const row of prevRes.data || []) {
        const day = new Date(row.date + "T00:00:00").getDate()
        prevDailyMap[day] = (prevDailyMap[day] || 0) + row.amount
      }

      // Build cumulative data points
      const totalDays = Math.max(daysInCurrentMonth, daysInPrevMonth)
      const result: MonthlyComparisonPoint[] = []
      let currentCumulative = 0
      let prevCumulative = 0

      for (let day = 1; day <= totalDays; day++) {
        // Previous month cumulative
        if (day <= daysInPrevMonth) {
          prevCumulative += prevDailyMap[day] || 0
        }

        // Current month cumulative (null for future days)
        let currentMonthValue: number | null = null
        if (day <= today && day <= daysInCurrentMonth) {
          currentCumulative += currentDailyMap[day] || 0
          currentMonthValue = currentCumulative
        }

        result.push({
          day,
          currentMonth: currentMonthValue,
          lastMonth: prevCumulative,
        })
      }

      return result
    } catch (error) {
      console.error("Unexpected error fetching monthly comparison:", error)
      return []
    }
  },
  [] // Fallback for unauthenticated users
)

/**
 * Gets the total expenses amount for the authenticated user.
 *
 * @returns Total expense amount or 0 if error/not authenticated
 */
export const getTotalExpenses = withAuthQueryNoInput<number>(
  async ({ user, supabase }) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching total expenses:", error.message)
        return 0
      }

      return data?.reduce((sum, expense) => sum + expense.amount, 0) || 0
    } catch (error) {
      console.error("Unexpected error fetching total expenses:", error)
      return 0
    }
  },
  0 // Fallback for unauthenticated users
)

/**
 * Gets the count of expenses for the authenticated user.
 *
 * @returns Number of expenses or 0 if error/not authenticated
 */
export const getExpenseCount = withAuthQueryNoInput<number>(
  async ({ user, supabase }) => {
    try {
      const { count, error } = await supabase
        .from("expenses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      if (error) {
        console.error("Error counting expenses:", error.message)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error("Unexpected error counting expenses:", error)
      return 0
    }
  },
  0 // Fallback for unauthenticated users
)

/**
 * Input type for date-range-based transaction queries
 */
interface TransactionDateRangeInput {
  startDate: Date
  endDate: Date
  /** Optional category to filter by. When omitted, all categories are returned. */
  category?: ExpenseCategory
}

/**
 * Result type for transaction queries with total
 */
interface TransactionDateRangeResult {
  expenses: Expense[]
  total: number
}

const EMPTY_TRANSACTIONS: TransactionDateRangeResult = {
  expenses: [],
  total: 0,
}

/**
 * Gets expenses within a date range for the authenticated user.
 *
 * @param input - Object containing startDate and endDate
 * @returns Object with the list of expenses and total amount spent
 *
 * @example
 * const { expenses, total } = await getTransactionsByDateRange({
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-01-31'),
 * })
 */
export const getTransactionsByDateRange = withAuthQuery<
  TransactionDateRangeInput,
  TransactionDateRangeResult
>(
  async ({ user, supabase }, { startDate, endDate, category }) => {
    try {
      // Use UTC-based upper bound to capture existing dates stored via toISOString()
      // (which could be +1 day ahead of local timezone). New expenses use local
      // timezone storage, so this is a backward-compatibility measure.
      const endDateUTC = endDate.toISOString().split("T")[0]

      let query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", formatUrlDate(startDate))
        .lte("date", endDateUTC)

      // Apply optional category filter
      if (category) {
        query = query.eq("category", category)
      }

      const { data: expenses, error } = await query
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching transactions:", error.message)
        return EMPTY_TRANSACTIONS
      }

      const expenseList = expenses || []
      const total = expenseList.reduce((sum, expense) => sum + expense.amount, 0)

      return { expenses: expenseList, total }
    } catch (error) {
      console.error("Unexpected error fetching transactions:", error)
      return EMPTY_TRANSACTIONS
    }
  },
  EMPTY_TRANSACTIONS // Fallback for unauthenticated users
)
