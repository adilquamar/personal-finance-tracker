"use server"

import { revalidatePath } from "next/cache"
import {
  withAuth,
  withAuthQuery,
  withAuthQueryNoInput,
} from "@/lib/auth"
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense"
import type { Expense } from "@/types/expense"
import type { ActionResult } from "@/types/common"

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
          date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
          title,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding expense:", error.message)
        return { success: false, error: "Failed to add expense. Please try again." }
      }

      // Revalidate dashboard to show new expense
      revalidatePath("/dashboard")

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
