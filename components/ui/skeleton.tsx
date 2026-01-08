import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Skeleton component - placeholder for loading content
 * Uses animate-pulse with visible gray background
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

export { Skeleton }
