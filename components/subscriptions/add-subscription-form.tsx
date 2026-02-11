"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validations/subscription"
import {
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "@/app/actions/subscriptions"
import { useFormAction } from "@/lib/hooks"
import { formatUrlDate } from "@/lib/utils/date-range"
import {
  dateFromDay,
  getDayFromAnchor,
  getDateFromAnchor,
} from "@/lib/utils/subscription"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { TitleField } from "./title-field"
import { AmountField } from "./amount-field"
import { CategoryField } from "./category-field"
import { RecurrenceField } from "./recurrence-field"
import { BillingDateField } from "./billing-date-field"
import type {
  SubscriptionWithStatus,
  SubscriptionRecurrence,
} from "@/types/subscription"
import type { ExpenseCategory } from "@/types/expense"
import { cn } from "@/lib/utils"


const DEFAULT_VALUES: SubscriptionFormData = {
  title: "",
  amount: undefined as unknown as number,
  category: undefined as unknown as ExpenseCategory,
  recurrence: undefined as unknown as SubscriptionRecurrence,
  billing_anchor_date: undefined as unknown as Date,
}

/**
 * Builds form default values from an existing subscription (edit mode).
 */
function buildEditDefaults(sub: SubscriptionWithStatus): SubscriptionFormData {
  return {
    title: sub.title,
    amount: sub.amount,
    category: sub.category,
    recurrence: sub.recurrence,
    billing_anchor_date:
      sub.recurrence === "monthly"
        ? dateFromDay(getDayFromAnchor(sub.billing_anchor_date))
        : getDateFromAnchor(sub.billing_anchor_date),
  }
}

interface AddSubscriptionFormProps {
  /** Whether the dialog is open */
  open: boolean
  /** Callback to toggle the dialog */
  onOpenChange: (open: boolean) => void
  /** When provided, the form enters edit mode pre-filled with this subscription */
  subscription?: SubscriptionWithStatus | null
}

/**
 * Dialog-based form for creating and editing subscriptions.
 * Uses RHF reset() to sync form values when the dialog opens.
 */
export function AddSubscriptionForm({
  open,
  onOpenChange,
  subscription,
}: AddSubscriptionFormProps) {
  const isEditing = !!subscription

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        subscription ? buildEditDefaults(subscription) : DEFAULT_VALUES
      )
    }
  }, [open, subscription, form])

  // ---- Server action hooks ------------------------------------------------

  const { execute: executeAdd, isLoading: isAdding } = useFormAction(
    addSubscription,
    {
      successMessage: "Subscription added successfully!",
      refreshOnSuccess: true,
      onSuccess: () => onOpenChange(false),
    }
  )

  const { execute: executeUpdate, isLoading: isUpdating } = useFormAction(
    updateSubscription,
    {
      successMessage: "Subscription updated successfully!",
      refreshOnSuccess: true,
      onSuccess: () => onOpenChange(false),
    }
  )

  const { execute: executeDelete, isLoading: isDeleting } = useFormAction(
    deleteSubscription,
    {
      successMessage: "Subscription deleted successfully!",
      refreshOnSuccess: true,
      onSuccess: () => onOpenChange(false),
    }
  )

  const isLoading = isAdding || isUpdating || isDeleting

  // ---- Handlers -----------------------------------------------------------

  const onSubmit = async (data: SubscriptionFormData) => {
    if (isEditing && subscription) {
      await executeUpdate({
        id: subscription.id,
        title: data.title,
        amount: data.amount,
        category: data.category,
        recurrence: data.recurrence,
        billing_anchor_date: formatUrlDate(data.billing_anchor_date),
      })
    } else {
      await executeAdd(data)
    }
  }

  const handleDelete = async () => {
    if (!subscription) return
    await executeDelete(subscription.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your recurring expense."
              : "Add a new recurring expense to track."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <TitleField disabled={isLoading} />
            <AmountField disabled={isLoading} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CategoryField disabled={isLoading} />
              <RecurrenceField disabled={isLoading} />
            </div>

            <BillingDateField disabled={isLoading} />

            {/* Submit and Delete buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-12 rounded-lg text-base font-medium",
                  "bg-indigo-500 text-white",
                  "hover:bg-indigo-600",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors"
                )}
              >
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Adding..."
                  : isEditing
                    ? "Update Subscription"
                    : "Add Subscription"}
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={handleDelete}
                  className="w-full h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Subscription"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
