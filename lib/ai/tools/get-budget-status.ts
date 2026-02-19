import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetBudgetStatus({ supabase, userId }: ToolContext) {
  return tool({
    description:
      "Get current budget vs actual spending per category for the current month. Shows how much is spent, budgeted, and remaining for each category.",
    parameters: z.object({}),
    execute: async () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const monthStart = `${year}-${String(month).padStart(2, "0")}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const monthEnd = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

      const [budgetsRes, expensesRes] = await Promise.all([
        supabase
          .from("budgets")
          .select("*")
          .eq("user_id", userId)
          .eq("period", "monthly"),
        supabase
          .from("expenses")
          .select("category, amount")
          .eq("user_id", userId)
          .gte("date", monthStart)
          .lte("date", monthEnd),
      ])

      if (budgetsRes.error) {
        console.error("Error fetching budgets:", budgetsRes.error.message)
        return []
      }

      if (expensesRes.error) {
        console.error("Error fetching expenses:", expensesRes.error.message)
        return []
      }

      const budgets = budgetsRes.data || []
      const expenses = expensesRes.data || []

      const spendingByCategory: Record<string, number> = {}
      for (const expense of expenses) {
        spendingByCategory[expense.category] =
          (spendingByCategory[expense.category] || 0) + expense.amount
      }

      return budgets.map((budget) => {
        const spent = spendingByCategory[budget.category] || 0
        const remaining = budget.amount - spent
        const percentUsed =
          budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0

        return {
          category: budget.category,
          budgeted: budget.amount,
          spent: Math.round(spent * 100) / 100,
          remaining: Math.round(remaining * 100) / 100,
          percentUsed,
          isExceeded: spent > budget.amount,
        }
      })
    },
  })
}
