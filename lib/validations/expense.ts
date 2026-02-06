import { z } from "zod"
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/types/expense"

/**
 * Zod schema for expense form validation
 */
export const expenseSchema = z.object({
  /**
   * Expense amount - must be positive with max 2 decimal places
   */
  amount: z
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
    ),

  /**
   * Expense category - must be one of the defined categories
   */
  category: z.enum(EXPENSE_CATEGORIES as [ExpenseCategory, ...ExpenseCategory[]], {
    required_error: "Category is required",
    invalid_type_error: "Please select a valid category",
  }),

  /**
   * Expense date - required Date object
   */
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Please select a valid date",
  }),

  /**
   * Expense title - required, max 255 characters
   */
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
})

/**
 * Type inferred from the expense schema for form data
 */
export type ExpenseFormData = z.infer<typeof expenseSchema>

