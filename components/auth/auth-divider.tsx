"use client"

import { cn } from "@/lib/utils"

interface AuthDividerProps {
  text?: string
  className?: string
}

export function AuthDivider({ text = "OR", className }: AuthDividerProps) {
  return (
    <div className={cn("relative py-4", className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-4 text-gray-400 font-medium tracking-wide">
          {text}
        </span>
      </div>
    </div>
  )
}

