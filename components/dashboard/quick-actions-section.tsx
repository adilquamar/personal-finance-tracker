import { TrendingUp, MessageSquare } from "lucide-react"
import { QuickActionCard } from "./quick-action-card"

export function QuickActionsSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <QuickActionCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="View Analytics"
          description="See spending insights"
          href="/analytics"
          comingSoon
        />
        <QuickActionCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="AI Assistant"
          description="Get financial advice"
          href="/chatbot"
          comingSoon
        />
      </div>
    </div>
  )
}

