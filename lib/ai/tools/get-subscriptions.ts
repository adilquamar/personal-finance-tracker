import { tool } from "ai"
import { z } from "zod"
import type { ToolContext } from "./types"

export function createGetSubscriptions({ supabase, userId }: ToolContext) {
  return tool({
    description:
      "Get all active recurring subscriptions with their amounts and billing frequency",
    parameters: z.object({}),
    execute: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("amount", { ascending: false })

      if (error) {
        console.error("Error fetching subscriptions:", error.message)
        return []
      }

      const subscriptions = data || []

      const monthlyTotal = subscriptions
        .filter((s) => s.recurrence === "monthly")
        .reduce((sum, s) => sum + s.amount, 0)

      const yearlyTotal = subscriptions
        .filter((s) => s.recurrence === "yearly")
        .reduce((sum, s) => sum + s.amount, 0)

      return {
        subscriptions: subscriptions.map((s) => ({
          title: s.title,
          amount: s.amount,
          category: s.category,
          recurrence: s.recurrence,
          billingAnchorDate: s.billing_anchor_date,
        })),
        monthlyTotal: Math.round(monthlyTotal * 100) / 100,
        yearlyTotal: Math.round(yearlyTotal * 100) / 100,
        annualizedTotal:
          Math.round((monthlyTotal * 12 + yearlyTotal) * 100) / 100,
      }
    },
  })
}
