"use client"

import { type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavButtonProps extends Omit<ButtonProps, "onClick"> {
  /** The URL to navigate to */
  href: string
  /** Content to show when not loading */
  children: ReactNode
  /** Icon to show when not loading */
  icon?: ReactNode
  /** Whether this button is currently in a loading/navigating state */
  isLoading?: boolean
  /** Click handler that receives the href */
  onNavigate: (href: string) => void
}

/**
 * Button component for navigation with built-in loading state.
 * Works with useNavigation hook for tracking navigation state.
 * 
 * @example
 * ```tsx
 * const { navigate, isNavigating } = useNavigation()
 * 
 * <NavButton
 *   href="/dashboard"
 *   onNavigate={navigate}
 *   isLoading={isNavigating("/dashboard")}
 *   icon={<ArrowRight className="h-4 w-4" />}
 * >
 *   Dashboard
 * </NavButton>
 * ```
 */
export function NavButton({
  href,
  children,
  icon,
  isLoading = false,
  onNavigate,
  className,
  disabled,
  ...props
}: NavButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isLoading && !disabled) {
      onNavigate(href)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={cn("gap-1.5", className)}
      {...props}
    >
      {children}
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
    </Button>
  )
}
