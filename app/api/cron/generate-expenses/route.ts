import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { env } from "@/lib/config/env"
import type { Subscription } from "@/types/subscription"
import type { ExpenseCategory } from "@/types/expense"

/**
 * Vercel Cron Job: Generate expenses from active subscriptions.
 * Runs daily at 06:00 UTC (configured in vercel.json).
 *
 * - Authenticates via Bearer token (CRON_SECRET)
 * - Uses a Supabase admin client (service role key) to bypass RLS
 * - Checks each active subscription against today's date
 * - Inserts expense records with idempotency checks
 * - Handles end-of-month edge cases (e.g., billing day 31 in a 30-day month)
 */
export async function GET(request: Request) {
  // 1. Verify the request is from Vercel Cron using CRON_SECRET
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Create a Supabase admin client (service role key, bypasses RLS)
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  )

  // 3. Fetch all active subscriptions
  const { data: subscriptions, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)

  if (fetchError) {
    console.error("Failed to fetch subscriptions:", fetchError.message)
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    )
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ generated: 0, skipped: 0, errors: 0 })
  }

  const today = new Date()
  const todayDate = today.toISOString().split("T")[0] // YYYY-MM-DD
  const currentDay = today.getDate()
  const currentMonth = today.getMonth() + 1 // 1-indexed
  const daysInCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()

  let generated = 0
  let skipped = 0
  let errors = 0

  // 4. Process each subscription independently
  for (const sub of subscriptions as Subscription[]) {
    try {
      const anchor = new Date(sub.billing_anchor_date + "T00:00:00")
      const billingDay = anchor.getDate()
      const billingMonth = anchor.getMonth() + 1 // 1-indexed

      // Handle end-of-month edge case:
      // If billingDay is 31 but current month has 30 days, use last day of month
      const effectiveBillingDay = Math.min(billingDay, daysInCurrentMonth)

      let isBillingDay = false

      if (sub.recurrence === "monthly") {
        // Monthly: today's date matches the effective billing day
        isBillingDay = currentDay === effectiveBillingDay
      } else if (sub.recurrence === "yearly") {
        // Yearly: month and day must both match
        isBillingDay =
          currentMonth === billingMonth && currentDay === effectiveBillingDay
      }

      if (!isBillingDay) {
        skipped++
        continue
      }

      // 5. Idempotency check: skip if expense already exists for this subscription + date
      const { data: existing, error: checkError } = await supabase
        .from("expenses")
        .select("id")
        .eq("subscription_id", sub.id)
        .eq("date", todayDate)
        .limit(1)

      if (checkError) {
        console.error(
          `Idempotency check failed for subscription ${sub.id}:`,
          checkError.message
        )
        errors++
        continue
      }

      if (existing && existing.length > 0) {
        skipped++
        continue
      }

      // 6. Insert new expense record
      const { error: insertError } = await supabase.from("expenses").insert({
        user_id: sub.user_id,
        title: sub.title,
        amount: sub.amount,
        category: sub.category as ExpenseCategory,
        date: todayDate,
        subscription_id: sub.id,
      })

      if (insertError) {
        console.error(
          `Failed to insert expense for subscription ${sub.id}:`,
          insertError.message
        )
        errors++
        continue
      }

      generated++
    } catch (error) {
      console.error(
        `Unexpected error processing subscription ${sub.id}:`,
        error
      )
      errors++
    }
  }

  // 7. Return summary
  return NextResponse.json({ generated, skipped, errors })
}
