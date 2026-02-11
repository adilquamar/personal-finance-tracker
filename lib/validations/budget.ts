import { z } from "zod"
import { BUDGET_PERIODS, type BudgetPeriod } from "@/types/budget"
import { amountValidator, categoryValidator } from "./shared"

/**
 * Zod schema for budget form validation
 */
export const budgetSchema = z.object({
  /**
   * Expense category - must be one of the defined categories
   */
  category: categoryValidator,

  /**
   * Budget period - monthly or yearly
   */
  period: z.enum(BUDGET_PERIODS as [BudgetPeriod, ...BudgetPeriod[]], {
    required_error: "Period is required",
    invalid_type_error: "Please select a valid period",
  }),

  /**
   * Budget amount - must be positive with max 2 decimal places
   */
  amount: amountValidator,
})

/**
 * Type inferred from the budget schema for form data
 */
export type BudgetFormData = z.infer<typeof budgetSchema>

/**
 * Cross-validation: if a user has both monthly and yearly budgets for the
 * same category, ensure monthly * 12 === yearly.
 *
 * This is a standalone refinement used at the action level when both
 * budgets exist, not inside the single-budget form schema.
 */
export function validateMonthlyYearlyConsistency(
  monthlyAmount: number,
  yearlyAmount: number
): { valid: boolean; message?: string } {
  const expectedYearly = Math.round(monthlyAmount * 12 * 100) / 100
  if (expectedYearly !== yearlyAmount) {
    return {
      valid: false,
      message: `Yearly budget ($${yearlyAmount}) should equal monthly ($${monthlyAmount}) × 12 = $${expectedYearly}`,
    }
  }
  return { valid: true }
}
