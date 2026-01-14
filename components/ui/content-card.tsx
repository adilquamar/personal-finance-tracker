import { cn } from "@/lib/utils"

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const

interface ContentCardProps {
  children: React.ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
}

export function ContentCard({
  children,
  className,
  padding = "md",
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
