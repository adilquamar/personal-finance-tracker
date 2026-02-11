"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { SubscriptionList } from "./subscription-list"
import type { SubscriptionWithStatus } from "@/types/subscription"

interface SubscriptionTabsProps {
  monthlyPaid: SubscriptionWithStatus[]
  monthlyUpcoming: SubscriptionWithStatus[]
  yearlyPaid: SubscriptionWithStatus[]
  yearlyUpcoming: SubscriptionWithStatus[]
  stats: {
    paidThisMonth: number
    upcomingThisMonth: number
    paidThisYear: number
    upcomingThisYear: number
  }
  onEdit: (subscription: SubscriptionWithStatus) => void
  onDelete: (subscriptionId: string) => void
}

/**
 * Tabbed view switching between Monthly and Yearly subscriptions.
 * Each tab shows two SubscriptionList sections: Paid and Upcoming.
 */
export function SubscriptionTabs({
  monthlyPaid,
  monthlyUpcoming,
  yearlyPaid,
  yearlyUpcoming,
  stats,
  onEdit,
  onDelete,
}: SubscriptionTabsProps) {
  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="yearly">Yearly</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly" className="space-y-6">
        <SubscriptionList
          label="Paid"
          subscriptions={monthlyPaid}
          totalAmount={stats.paidThisMonth}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <SubscriptionList
          label="Upcoming"
          subscriptions={monthlyUpcoming}
          totalAmount={stats.upcomingThisMonth}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="yearly" className="space-y-6">
        <SubscriptionList
          label="Paid"
          subscriptions={yearlyPaid}
          totalAmount={stats.paidThisYear}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <SubscriptionList
          label="Upcoming"
          subscriptions={yearlyUpcoming}
          totalAmount={stats.upcomingThisYear}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  )
}
