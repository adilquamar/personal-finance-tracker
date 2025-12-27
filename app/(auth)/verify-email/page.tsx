"use client"

import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { AuthSuccessMessage } from "@/components/auth"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <AuthSuccessMessage
      icon={Mail}
      variant="info"
      title="Check your email"
      message={
        <>
          <p className="mb-2">
            We sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-gray-900">{email}</span>
            ) : (
              "your email address"
            )}
          </p>
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account. If you don&apos;t see it,
            check your spam folder.
          </p>
        </>
      }
      linkText="Back to sign in"
      linkHref="/login"
    />
  )
}

