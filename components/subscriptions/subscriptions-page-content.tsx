"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { SubscriptionStats } from "./subscription-stats"
import { SubscriptionTabs } from "./subscription-tabs"
import { AddSubscriptionForm } from "./add-subscription-form"
import { deleteSubscription } from "@/app/actions/subscriptions"
import { useFormAction } from "@/lib/hooks"
import type {
  SubscriptionsPageData,
  SubscriptionWithStatus,
} from "@/types/subscription"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionsPageContentProps {
  data: SubscriptionsPageData
}

/**
 * Client orchestrator component for the subscriptions page.
 * Composes stats, add/edit dialog, and tabbed subscription lists.
 * Receives fully-structured page data from the server component.
 */
export function SubscriptionsPageContent({
  data,
}: SubscriptionsPageContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionWithStatus | null>(null)

  // Delete action (used when the delete button on a card is clicked directly)
  const { execute: executeDelete } = useFormAction(deleteSubscription, {
    successMessage: "Subscription deleted successfully!",
    refreshOnSuccess: true,
  })

  const handleAddNew = useCallback(() => {
    setEditingSubscription(null)
    setDialogOpen(true)
  }, [])

  const handleEdit = useCallback((subscription: SubscriptionWithStatus) => {
    setEditingSubscription(subscription)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (subscriptionId: string) => {
      await executeDelete(subscriptionId)
    },
    [executeDelete]
  )

  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingSubscription(null)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <SubscriptionStats stats={data.stats} />

      {/* Add button */}
      <div className="flex justify-end">
        <Button
          onClick={handleAddNew}
          className={cn(
            "h-10 rounded-lg text-sm font-medium",
            "bg-indigo-500 text-white",
            "hover:bg-indigo-600",
            "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
            "transition-colors"
          )}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Tabs: Monthly / Yearly with Paid + Upcoming lists */}
      <SubscriptionTabs
        monthlyPaid={data.monthlyPaid}
        monthlyUpcoming={data.monthlyUpcoming}
        yearlyPaid={data.yearlyPaid}
        yearlyUpcoming={data.yearlyUpcoming}
        stats={data.stats}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit dialog */}
      <AddSubscriptionForm
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        subscription={editingSubscription}
      />
    </div>
  )
}
