import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
  href?: string
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
}

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
}

export function Logo({ 
  className, 
  size = "md", 
  showText = true,
  href = "/"
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg",
          sizeClasses[size]
        )} 
      />
      {showText && (
        <span className={cn("font-medium text-gray-900", textSizeClasses[size])}>
          FinanceTracker
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

