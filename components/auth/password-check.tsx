"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordCheckProps {
  passed: boolean
  text: string
}

export function PasswordCheck({ passed, text }: PasswordCheckProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center w-4 h-4 rounded-full transition-colors",
          passed ? "bg-green-500" : "bg-gray-200"
        )}
      >
        {passed && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={cn(
          "text-xs transition-colors",
          passed ? "text-green-600" : "text-gray-500"
        )}
      >
        {text}
      </span>
    </div>
  )
}

