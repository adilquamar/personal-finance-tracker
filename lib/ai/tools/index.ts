import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { createGetExpensesByDateRange } from "./get-expenses-by-date-range"
import { createGetTopExpenses } from "./get-top-expenses"
import { createGetCategoryBreakdown } from "./get-category-breakdown"
import { createGetBudgetStatus } from "./get-budget-status"
import { createGetSubscriptions } from "./get-subscriptions"
import { createGetMonthlyTrend } from "./get-monthly-trend"

/**
 * Creates all financial data tools for the AI assistant.
 * Each tool receives the Supabase client and user_id via closure for security.
 */
export function createFinancialTools(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const context = { supabase, userId }

  return {
    getExpensesByDateRange: createGetExpensesByDateRange(context),
    getTopExpenses: createGetTopExpenses(context),
    getCategoryBreakdown: createGetCategoryBreakdown(context),
    getBudgetStatus: createGetBudgetStatus(context),
    getSubscriptions: createGetSubscriptions(context),
    getMonthlyTrend: createGetMonthlyTrend(context),
  }
}
