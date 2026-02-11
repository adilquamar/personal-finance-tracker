import { z } from "zod"
import {
  titleValidator,
  amountValidator,
  categoryValidator,
  dateValidator,
} from "./shared"

/**
 * Zod schema for expense form validation
 */
export const expenseSchema = z.object({
  /**
   * Expense amount - must be positive with max 2 decimal places
   */
  amount: amountValidator,

  /**
   * Expense category - must be one of the defined categories
   */
  category: categoryValidator,

  /**
   * Expense date - required Date object
   */
  date: dateValidator,

  /**
   * Expense title - required, max 255 characters
   */
  title: titleValidator,
})

/**
 * Type inferred from the expense schema for form data
 */
export type ExpenseFormData = z.infer<typeof expenseSchema>

