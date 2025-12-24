import { TrendingUp, Wallet, BarChart3, Bot, Shield, Sparkles } from "lucide-react"
import { FeatureCard, type Feature } from "./feature-card"

const defaultFeatures: Feature[] = [
  {
    icon: Wallet,
    title: 'Smart Expense Tracking',
    description: 'Effortlessly log and categorize your expenses. Our intelligent system learns your patterns and auto-suggests categories.',
  },
  {
    icon: BarChart3,
    title: 'Beautiful Analytics',
    description: 'Visualize your spending with stunning charts and reports. Understand where your money goes at a glance.',
  },
  {
    icon: Bot,
    title: 'AI Financial Assistant',
    description: 'Get personalized advice and insights from our AI chatbot. Ask questions about your spending in natural language.',
  },
  {
    icon: TrendingUp,
    title: 'Budget Goals',
    description: "Set and track budget goals for different categories. Get alerts when you're approaching your limits.",
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted and secure. We use the same security standards as major financial institutions.',
  },
  {
    icon: Sparkles,
    title: 'Smart Insights',
    description: 'Receive proactive suggestions to save money based on your spending patterns and financial goals.',
  },
]

interface FeaturesSectionProps {
  id?: string
  badge?: {
    icon?: React.ReactNode
    text: string
  }
  headline?: React.ReactNode
  subheadline?: string
  features?: Feature[]
}

export function FeaturesSection({
  id = "features",
  badge = {
    icon: <TrendingUp className="h-4 w-4 text-indigo-500" />,
    text: "Powerful Features"
  },
  headline = (
    <>
      Everything You Need to{' '}
      <span className="text-indigo-500">Take Control</span>
    </>
  ),
  subheadline = "From simple expense tracking to AI-powered insights, FinanceTracker gives you all the tools to understand and improve your financial health.",
  features = defaultFeatures
}: FeaturesSectionProps) {
  return (
    <section id={id} className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              {badge.icon}
              <span className="text-sm font-medium text-indigo-600">{badge.text}</span>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight mb-4">
            {headline}
          </h2>
          <p className="text-lg text-gray-500">
            {subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

