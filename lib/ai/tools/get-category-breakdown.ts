import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetCategoryBreakdown({ supabase, userId }: ToolContext) {
  return tool({
    description:
      "Get expenses summed by category for a date range. Returns total spending per category.",
    parameters: z.object({
      startDate: z.string().describe("Start date in YYYY-MM-DD format"),
      endDate: z.string().describe("End date in YYYY-MM-DD format"),
    }),
    execute: async ({ startDate, endDate }) => {
      const { data, error } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)

      if (error) {
        console.error("Error fetching category breakdown:", error.message)
        return []
      }

      const expenses = data || []
      const breakdown: Record<string, number> = {}

      for (const expense of expenses) {
        breakdown[expense.category] =
          (breakdown[expense.category] || 0) + expense.amount
      }

      return Object.entries(breakdown)
        .map(([category, total]) => ({
          category,
          total: Math.round(total * 100) / 100,
        }))
        .sort((a, b) => b.total - a.total)
    },
  })
}
