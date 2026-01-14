import { ContentCard } from "@/components/ui/content-card"

interface StatCardProps {
  label: string
  value: string
  sublabel: string
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <ContentCard padding="sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{sublabel}</p>
    </ContentCard>
  )
}
