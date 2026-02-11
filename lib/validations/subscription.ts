import { z } from "zod"
import {
  SUBSCRIPTION_RECURRENCES,
  type SubscriptionRecurrence,
} from "@/types/subscription"
import {
  titleValidator,
  amountValidator,
  categoryValidator,
  dateValidator,
} from "./shared"

/**
 * Zod schema for subscription form validation
 */
export const subscriptionSchema = z.object({
  /**
   * Subscription title - required, max 255 characters
   */
  title: titleValidator,

  /**
   * Subscription amount - must be positive with max 2 decimal places
   */
  amount: amountValidator,

  /**
   * Expense category - must be one of the defined categories
   */
  category: categoryValidator,

  /**
   * Recurrence type - monthly or yearly
   */
  recurrence: z.enum(
    SUBSCRIPTION_RECURRENCES as [
      SubscriptionRecurrence,
      ...SubscriptionRecurrence[],
    ],
    {
      required_error: "Recurrence type is required",
      invalid_type_error: "Please select a valid recurrence type",
    }
  ),

  /**
   * Billing anchor date - required Date object used to determine billing day/month
   */
  billing_anchor_date: dateValidator,
})

/**
 * Type inferred from the subscription schema for form data
 */
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>
