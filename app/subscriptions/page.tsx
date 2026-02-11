import { getSubscriptionsPageData } from "@/app/actions/subscriptions"
import { SubscriptionsPageContent } from "@/components/subscriptions"

export default async function SubscriptionsPage() {
  const data = await getSubscriptionsPageData()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your recurring expenses
          </p>
        </div>
        <SubscriptionsPageContent data={data} />
      </div>
    </div>
  )
}
