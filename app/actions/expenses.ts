"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense"
import type { Expense } from "@/types/expense"

/**
 * Result type for expense actions
 */
export type ExpenseActionResult = 
  | { success: true; data?: Expense }
  | { success: false; error: string }

/**
 * Adds a new expense for the authenticated user.
 * 
 * @param formData - The expense form data
 * @returns Success with the created expense or error message
 */
export async function addExpense(formData: ExpenseFormData): Promise<ExpenseActionResult> {
  // Check authentication
  const user = await getUser()
  if (!user) {
    return { success: false, error: "You must be logged in to add an expense" }
  }

  // Validate form data
  const validationResult = expenseSchema.safeParse(formData)
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0]?.message || "Invalid expense data",
    }
  }

  const { amount, category, date, description } = validationResult.data

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        amount,
        category,
        date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
        description: description || null,
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
}

/**
 * Gets recent expenses for the authenticated user.
 * 
 * @param limit - Maximum number of expenses to return (default: 10)
 * @returns Array of recent expenses ordered by date descending
 */
export async function getRecentExpenses(limit: number = 10): Promise<Expense[]> {
  // Check authentication
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
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching expenses:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching expenses:", error)
    return []
  }
}

/**
 * Gets the total expenses amount for the authenticated user.
 * 
 * @returns Total expense amount or 0 if error/not authenticated
 */
export async function getTotalExpenses(): Promise<number> {
  // Check authentication
  const user = await getUser()
  if (!user) {
    return 0
  }

  try {
    const supabase = await createClient()

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
}

/**
 * Gets the count of expenses for the authenticated user.
 * 
 * @returns Number of expenses or 0 if error/not authenticated
 */
export async function getExpenseCount(): Promise<number> {
  // Check authentication
  const user = await getUser()
  if (!user) {
    return 0
  }

  try {
    const supabase = await createClient()

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
}

