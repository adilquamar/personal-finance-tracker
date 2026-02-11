"use server"

import { revalidatePath } from "next/cache"
import { withAuth, withAuthQueryNoInput } from "@/lib/auth"
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations/subscription"
import { formatUrlDate } from "@/lib/utils/date-range"
import {
  getDaysInMonth,
  toDateString,
  computeStatus,
  computeNextBillingDate,
} from "@/lib/utils/subscription"
import type {
  Subscription,
  SubscriptionWithStatus,
  UpdateSubscriptionInput,
  SubscriptionsPageData,
} from "@/types/subscription"

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Adds a new subscription for the authenticated user.
 *
 * Validates input with the subscription Zod schema, inserts into the
 * subscriptions table, and -- if the billing date has already passed in the
 * current period -- also generates the first expense record (with
 * subscription_id set).
 */
export const addSubscription = withAuth<SubscriptionFormData, Subscription>(
  async ({ user, supabase }, formData) => {
    // Validate form data
    const validationResult = subscriptionSchema.safeParse(formData)
    if (!validationResult.success) {
      return {
        success: false,
        error:
          validationResult.error.errors[0]?.message ||
          "Invalid subscription data",
      }
    }

    const { title, amount, category, recurrence, billing_anchor_date } =
      validationResult.data

    try {
      const billingDateStr = formatUrlDate(billing_anchor_date)

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          title,
          amount,
          category,
          recurrence,
          billing_anchor_date: billingDateStr,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding subscription:", error.message)
        return {
          success: false,
          error: "Failed to add subscription. Please try again.",
        }
      }

      const subscription = data as Subscription

      // If the billing date has already passed in the current period, generate
      // the first expense so the user immediately sees it in their records.
      const today = new Date()
      const status = computeStatus(subscription, today)

      if (status === "paid") {
        const anchor = new Date(billingDateStr + "T00:00:00")
        let expenseDate: string

        if (recurrence === "monthly") {
          const maxDay = getDaysInMonth(
            today.getFullYear(),
            today.getMonth() + 1
          )
          const effectiveDay = Math.min(anchor.getDate(), maxDay)
          expenseDate = toDateString(
            today.getFullYear(),
            today.getMonth(),
            effectiveDay
          )
        } else {
          // Yearly – expense date is the billing month+day this year
          const billingMonth = anchor.getMonth()
          const maxDay = getDaysInMonth(today.getFullYear(), billingMonth + 1)
          const effectiveDay = Math.min(anchor.getDate(), maxDay)
          expenseDate = toDateString(
            today.getFullYear(),
            billingMonth,
            effectiveDay
          )
        }

        const { error: expenseError } = await supabase
          .from("expenses")
          .insert({
            user_id: user.id,
            title,
            amount,
            category,
            date: expenseDate,
            subscription_id: subscription.id,
          })

        if (expenseError) {
          // Log but don't fail the subscription creation
          console.error(
            "Error generating first expense for subscription:",
            expenseError.message
          )
        }
      }

      revalidatePath("/", "layout")
      return { success: true, data: subscription }
    } catch (error) {
      console.error("Unexpected error adding subscription:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  },
  { errorMessage: "You must be logged in to add a subscription" }
)

/**
 * Updates an existing subscription.
 *
 * Accepts a subscription id and a partial set of update fields. Only provided
 * fields are written to the database.
 */
export const updateSubscription = withAuth<
  { id: string } & UpdateSubscriptionInput,
  Subscription
>(
  async ({ user, supabase }, { id, ...updates }) => {
    try {
      // Build the update payload, only including defined fields
      const updatePayload: Record<string, unknown> = {}
      if (updates.title !== undefined) updatePayload.title = updates.title
      if (updates.amount !== undefined) updatePayload.amount = updates.amount
      if (updates.category !== undefined)
        updatePayload.category = updates.category
      if (updates.recurrence !== undefined)
        updatePayload.recurrence = updates.recurrence
      if (updates.billing_anchor_date !== undefined)
        updatePayload.billing_anchor_date = updates.billing_anchor_date
      if (updates.is_active !== undefined)
        updatePayload.is_active = updates.is_active

      if (Object.keys(updatePayload).length === 0) {
        return { success: false, error: "No fields to update" }
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updatePayload)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating subscription:", error.message)
        return {
          success: false,
          error: "Failed to update subscription. Please try again.",
        }
      }

      revalidatePath("/", "layout")
      return { success: true, data: data as Subscription }
    } catch (error) {
      console.error("Unexpected error updating subscription:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  },
  { errorMessage: "You must be logged in to update a subscription" }
)

/**
 * Deletes a subscription by id.
 *
 * Expenses linked via subscription_id are preserved -- the database ON DELETE
 * SET NULL constraint handles nullifying the foreign key automatically.
 */
export const deleteSubscription = withAuth<string, void>(
  async ({ user, supabase }, id) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting subscription:", error.message)
        return {
          success: false,
          error: "Failed to delete subscription. Please try again.",
        }
      }

      revalidatePath("/", "layout")
      return { success: true }
    } catch (error) {
      console.error("Unexpected error deleting subscription:", error)
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      }
    }
  },
  { errorMessage: "You must be logged in to delete a subscription" }
)

// ---------------------------------------------------------------------------
// Query: Subscriptions Page Data
// ---------------------------------------------------------------------------

/** Empty fallback for unauthenticated users */
const EMPTY_PAGE_DATA: SubscriptionsPageData = {
  subscriptions: [],
  monthlyPaid: [],
  monthlyUpcoming: [],
  yearlyPaid: [],
  yearlyUpcoming: [],
  stats: {
    totalMonthlyCost: 0,
    totalYearlyCost: 0,
    paidThisMonth: 0,
    upcomingThisMonth: 0,
    paidThisYear: 0,
    upcomingThisYear: 0,
  },
}

/**
 * Fetches all active subscriptions for the authenticated user and returns
 * structured page data including:
 *
 * - Subscriptions split into monthly/yearly × paid/upcoming groups
 * - Computed next_billing_date for each subscription
 * - Summary statistics (totals and paid/upcoming amounts)
 */
export const getSubscriptionsPageData =
  withAuthQueryNoInput<SubscriptionsPageData>(
    async ({ user, supabase }) => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .order("billing_anchor_date", { ascending: true })

        if (error) {
          console.error("Error fetching subscriptions:", error.message)
          return EMPTY_PAGE_DATA
        }

        const subscriptions = (data || []) as Subscription[]
        const today = new Date()

        const monthlyPaid: SubscriptionWithStatus[] = []
        const monthlyUpcoming: SubscriptionWithStatus[] = []
        const yearlyPaid: SubscriptionWithStatus[] = []
        const yearlyUpcoming: SubscriptionWithStatus[] = []

        for (const sub of subscriptions) {
          const status = computeStatus(sub, today)
          const next_billing_date = computeNextBillingDate(sub, today, status)

          const enriched: SubscriptionWithStatus = {
            ...sub,
            status,
            next_billing_date,
          }

          if (sub.recurrence === "monthly") {
            if (status === "paid") {
              monthlyPaid.push(enriched)
            } else {
              monthlyUpcoming.push(enriched)
            }
          } else {
            if (status === "paid") {
              yearlyPaid.push(enriched)
            } else {
              yearlyUpcoming.push(enriched)
            }
          }
        }

        // Compute summary statistics
        const totalMonthlyCost = subscriptions
          .filter((s) => s.recurrence === "monthly")
          .reduce((sum, s) => sum + s.amount, 0)

        const totalYearlyCost = subscriptions
          .filter((s) => s.recurrence === "yearly")
          .reduce((sum, s) => sum + s.amount, 0)

        const paidThisMonth = monthlyPaid.reduce(
          (sum, s) => sum + s.amount,
          0
        )
        const upcomingThisMonth = monthlyUpcoming.reduce(
          (sum, s) => sum + s.amount,
          0
        )

        const paidThisYear = yearlyPaid.reduce((sum, s) => sum + s.amount, 0)
        const upcomingThisYear = yearlyUpcoming.reduce(
          (sum, s) => sum + s.amount,
          0
        )

        return {
          subscriptions,
          monthlyPaid,
          monthlyUpcoming,
          yearlyPaid,
          yearlyUpcoming,
          stats: {
            totalMonthlyCost,
            totalYearlyCost,
            paidThisMonth,
            upcomingThisMonth,
            paidThisYear,
            upcomingThisYear,
          },
        }
      } catch (error) {
        console.error(
          "Unexpected error fetching subscriptions page data:",
          error
        )
        return EMPTY_PAGE_DATA
      }
    },
    EMPTY_PAGE_DATA
  )
