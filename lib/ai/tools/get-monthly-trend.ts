import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetMonthlyTrend({ supabase, userId }: ToolContext) {
  return tool({
    description:
      "Get monthly spending totals for the last N months to show spending trends over time",
    parameters: z.object({
      months: z
        .number()
        .default(6)
        .describe("Number of months to look back (default 6)"),
    }),
    execute: async ({ months }) => {
      const now = new Date()
      const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

      const startDate = new Date(now)
      startDate.setMonth(startDate.getMonth() - months + 1)
      startDate.setDate(1)
      const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-01`

      const { data, error } = await supabase
        .from("expenses")
        .select("date, amount")
        .eq("user_id", userId)
        .gte("date", startDateStr)
        .lte("date", endDate)

      if (error) {
        console.error("Error fetching monthly trend:", error.message)
        return []
      }

      const expenses = data || []
      const monthlyTotals: Record<string, number> = {}

      for (const expense of expenses) {
        const monthKey = expense.date.slice(0, 7)
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount
      }

      const result: Array<{ month: string; total: number }> = []
      const current = new Date(startDate)

      while (current <= now) {
        const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`
        result.push({
          month: monthKey,
          total: Math.round((monthlyTotals[monthKey] || 0) * 100) / 100,
        })
        current.setMonth(current.getMonth() + 1)
      }

      return result
    },
  })
}
