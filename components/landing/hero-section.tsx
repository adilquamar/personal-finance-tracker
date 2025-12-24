import Link from "next/link"
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardPreview } from "./dashboard-preview"

interface HeroSectionProps {
  badge?: {
    icon?: React.ReactNode
    text: string
  }
  headline?: React.ReactNode
  subheadline?: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
  }
  showDashboardPreview?: boolean
}

export function HeroSection({
  badge = {
    icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
    text: "AI-Powered Financial Insights"
  },
  headline = (
    <>
      Take Control of Your{' '}
      <span className="text-indigo-500">Personal Finances</span>
    </>
  ),
  subheadline = "Track expenses effortlessly, gain powerful insights with beautiful analytics, and let AI help you make smarter financial decisions.",
  primaryCta = {
    text: "Start Free Trial",
    href: "/signup"
  },
  secondaryCta = {
    text: "See How It Works",
    href: "#features"
  },
  showDashboardPreview = true
}: HeroSectionProps) {
  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              {badge.icon}
              <span className="text-sm font-medium text-indigo-600">{badge.text}</span>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-gray-900 tracking-tight mb-6">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCta && (
              <Button 
                size="lg" 
                asChild 
                className="w-full sm:w-auto gap-2 bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-8 rounded-xl"
              >
                <Link href={primaryCta.href}>
                  {primaryCta.text}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            )}
            {secondaryCta && (
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="w-full sm:w-auto gap-2 h-12 px-8 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Link href={secondaryCta.href}>
                  {secondaryCta.text}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Preview */}
        {showDashboardPreview && <DashboardPreview />}
      </div>
    </section>
  )
}

