import { z } from "zod"
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense"
import { BUDGET_PERIODS, type BudgetPeriod } from "@/types/budget"

/**
 * Zod schema for budget form validation
 */
export const budgetSchema = z.object({
  /**
   * Expense category - must be one of the defined categories
   */
  category: z.enum(EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]], {
    required_error: "Category is required",
    invalid_type_error: "Please select a valid category",
  }),

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
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than 0")
    .refine(
      (val) => {
        const decimalPlaces = (val.toString().split(".")[1] || "").length
        return decimalPlaces <= 2
      },
      { message: "Amount can have at most 2 decimal places" }
    ),
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
