import { z } from "zod"
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense"

/**
 * Shared validation schemas used across multiple forms
 */

/**
 * Title field - required string with 1-255 character limit
 * Used by: expenses, subscriptions, budgets
 */
export const titleValidator = z
  .string({
    required_error: "Title is required",
  })
  .min(1, "Title is required")
  .max(255, "Title must be at most 255 characters")

/**
 * Amount field - positive number with max 2 decimal places
 * Used by: expenses, subscriptions, budgets
 */
export const amountValidator = z
  .number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  })
  .positive("Amount must be greater than 0")
  .refine(
    (val) => {
      // Check for max 2 decimal places
      const decimalPlaces = (val.toString().split(".")[1] || "").length
      return decimalPlaces <= 2
    },
    { message: "Amount can have at most 2 decimal places" }
  )

/**
 * Category field - must be one of the defined expense categories
 * Used by: expenses, subscriptions
 */
export const categoryValidator = z.enum(
  EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]],
  {
    required_error: "Category is required",
    invalid_type_error: "Please select a valid category",
  }
)

/**
 * Date field - required Date object
 * Used by: expenses (date), subscriptions (billing_anchor_date)
 */
export const dateValidator = z.date({
  required_error: "Date is required",
  invalid_type_error: "Please select a valid date",
})
