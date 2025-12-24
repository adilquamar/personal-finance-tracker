import {
  LandingFooter,
  HeroSection,
  FeaturesSection,
  CTASection,
} from "@/components/landing"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      
      <HeroSection />
      
      <FeaturesSection />
      
      <CTASection />
      
      <LandingFooter />
    </div>
  )
}
