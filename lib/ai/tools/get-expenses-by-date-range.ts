import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetExpensesByDateRange({ supabase, userId }: ToolContext) {
  return tool({
    description:
      "Fetch the user's expenses between two dates, optionally filtered by category",
    parameters: z.object({
      startDate: z.string().describe("Start date in YYYY-MM-DD format"),
      endDate: z.string().describe("End date in YYYY-MM-DD format"),
      category: z
        .string()
        .optional()
        .describe("Optional expense category filter"),
    }),
    execute: async ({ startDate, endDate, category }) => {
      let query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false })

      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching expenses:", error.message)
        return []
      }

      return data || []
    },
  })
}
