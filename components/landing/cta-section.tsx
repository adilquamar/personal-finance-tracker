import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
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
}

export function CTASection({
  headline = (
    <>
      Ready to Take Control of{' '}
      <span className="text-indigo-500">Your Finances?</span>
    </>
  ),
  subheadline = "Start your free trial today. No credit card required. See why thousands trust FinanceTracker with their financial journey.",
  primaryCta = {
    text: "Get Started for Free",
    href: "/signup"
  },
  secondaryCta = {
    text: "Already have an account?",
    href: "/login"
  }
}: CTASectionProps) {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden">
          <div className="relative p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight mb-4">
              {headline}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              {subheadline}
            </p>
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
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Link href={secondaryCta.href}>
                    {secondaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

