import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetTopExpenses({ supabase, userId }: ToolContext) {
  return tool({
    description: "Get the N largest expenses in a date range",
    parameters: z.object({
      startDate: z.string().describe("Start date in YYYY-MM-DD format"),
      endDate: z.string().describe("End date in YYYY-MM-DD format"),
      limit: z
        .number()
        .default(5)
        .describe("Number of expenses to return (default 5)"),
    }),
    execute: async ({ startDate, endDate, limit }) => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("amount", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching top expenses:", error.message)
        return []
      }

      return data || []
    },
  })
}
