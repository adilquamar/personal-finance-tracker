"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-4">Something went wrong</h2>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
