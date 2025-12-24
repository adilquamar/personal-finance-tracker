import {
  LandingHeader,
  LandingFooter,
  HeroSection,
  FeaturesSection,
  CTASection,
} from "@/components/landing"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      
      <HeroSection />
      
      <FeaturesSection />
      
      <CTASection />
      
      <LandingFooter />
    </div>
  )
}
