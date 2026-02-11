"use client"

import { ContentCard } from "@/components/ui/content-card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/format"
import { getBillingDateText } from "@/lib/utils/subscription"
import {
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
} from "@/types/expense"
import type { SubscriptionWithStatus } from "@/types/subscription"
import { CheckCircle2, Clock, Pencil, Trash2 } from "lucide-react"

interface SubscriptionCardProps {
  subscription: SubscriptionWithStatus
  onEdit: (subscription: SubscriptionWithStatus) => void
  onDelete: (subscriptionId: string) => void
}

/**
 * Individual subscription card displaying title, amount, category,
 * billing schedule, status, and edit/delete actions.
 */
export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const isPaid = subscription.status === "paid"

  return (
    <ContentCard padding="sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Title and amount */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {subscription.title}
            </h3>
            {isPaid ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <Clock className="h-4 w-4 shrink-0 text-gray-400" />
            )}
          </div>

          <p className="text-lg font-medium text-gray-900">
            {formatCurrency(subscription.amount)}
          </p>

          {/* Category badge and billing date */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
              {EXPENSE_CATEGORY_LABELS[subscription.category as ExpenseCategory]}
            </span>
            <span className="text-xs text-gray-500">
              {getBillingDateText(
                subscription.billing_anchor_date,
                subscription.recurrence
              )}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            onClick={() => onEdit(subscription)}
            aria-label={`Edit ${subscription.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(subscription.id)}
            aria-label={`Delete ${subscription.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ContentCard>
  )
}
