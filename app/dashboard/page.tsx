import { requireAuth } from "@/lib/auth"
import { LayoutDashboard, TrendingUp, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { VerificationSuccessAlert } from "@/components/auth"

export default async function DashboardPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Email Verification Success Alert */}
        <VerificationSuccessAlert />

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Welcome back{user.fullName ? `, ${user.fullName}` : ""}!
          </h1>
          <p className="text-gray-500">
            Here&apos;s an overview of your financial activity.
          </p>
        </div>

        {/* Stats Grid - Placeholder */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Total Expenses" 
            value="$0.00" 
            sublabel="This month"
          />
          <StatCard 
            label="Categories" 
            value="0" 
            sublabel="Active"
          />
          <StatCard 
            label="Transactions" 
            value="0" 
            sublabel="This month"
          />
          <StatCard 
            label="Budget" 
            value="--" 
            sublabel="Not set"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickActionCard
              icon={<LayoutDashboard className="h-6 w-6" />}
              title="Add Expense"
              description="Track a new transaction"
              href="/dashboard"
              comingSoon
            />
            <QuickActionCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="View Analytics"
              description="See spending insights"
              href="/analytics"
              comingSoon
            />
            <QuickActionCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="AI Assistant"
              description="Get financial advice"
              href="/chatbot"
              comingSoon
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No expenses yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start tracking your expenses to see insights and analytics about your spending habits.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
          >
            Add Your First Expense
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-gray-400 mt-3">Coming soon</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  sublabel 
}: { 
  label: string
  value: string
  sublabel: string 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{sublabel}</p>
    </div>
  )
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  comingSoon = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  comingSoon?: boolean
}) {
  if (comingSoon) {
    return (
      <div className="relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-not-allowed">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-400">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full">
          Soon
        </span>
      </div>
    )
  }

  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group"
    >
      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  )
}

