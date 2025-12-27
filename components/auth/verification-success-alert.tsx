"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, X } from "lucide-react"

export function VerificationSuccessAlert() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show alert if verified=true in URL
    if (searchParams.get("verified") === "true") {
      setIsVisible(true)
      
      // Clean up the URL without affecting navigation history
      const url = new URL(window.location.href)
      url.searchParams.delete("verified")
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [searchParams, router])

  if (!isVisible) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-green-800">Email verified successfully!</p>
        <p className="text-sm text-green-700 mt-0.5">
          Your account is now fully activated. Welcome to FinanceTracker!
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-green-600 hover:text-green-800 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

