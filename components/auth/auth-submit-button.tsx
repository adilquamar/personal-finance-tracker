"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthSubmitButtonProps {
  isLoading: boolean
  disabled?: boolean
  loadingText: string
  children: React.ReactNode
}

export function AuthSubmitButton({
  isLoading,
  disabled,
  loadingText,
  children,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full h-12 px-4",
        "bg-indigo-400 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        "transition-all duration-150"
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

