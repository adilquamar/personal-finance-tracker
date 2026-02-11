"use client"

import { formatCurrency } from "@/lib/utils/format"
import { SubscriptionCard } from "./subscription-card"
import type { SubscriptionWithStatus } from "@/types/subscription"

interface SubscriptionListProps {
  /** Section label, e.g. "Paid" or "Upcoming" */
  label: string
  /** Subscriptions to display in this section */
  subscriptions: SubscriptionWithStatus[]
  /** Total amount for the section header */
  totalAmount: number
  /** Callback when the user clicks the edit button on a card */
  onEdit: (subscription: SubscriptionWithStatus) => void
  /** Callback when the user clicks the delete button on a card */
  onDelete: (subscriptionId: string) => void
}

/**
 * Renders a labelled section with a count + total amount header and
 * a responsive grid of SubscriptionCard components.
 * Shows an empty state message when there are no subscriptions.
 */
export function SubscriptionList({
  label,
  subscriptions,
  totalAmount,
  onEdit,
  onDelete,
}: SubscriptionListProps) {
  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">{label}</h3>
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            {subscriptions.length}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Cards grid or empty state */}
      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            No {label.toLowerCase()} subscriptions
          </p>
        </div>
      )}
    </div>
  )
}
