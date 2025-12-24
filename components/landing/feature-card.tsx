import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface FeatureCardProps {
  feature: Feature
  className?: string
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const { icon: Icon, title, description } = feature

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 mb-4">
        <Icon className="h-6 w-6 text-indigo-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}

