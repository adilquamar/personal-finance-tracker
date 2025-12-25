"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth"
import { resetPassword } from "@/app/actions/auth"
import { AuthEmailField, AuthSubmitButton } from "@/components/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await resetPassword(data.email)
      
      if (result.success) {
        setSubmittedEmail(data.email)
        setIsSubmitted(true)
      } else {
        setError(result.error)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setIsSubmitted(false)
    form.reset({ email: submittedEmail })
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <Mail className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3">
              Check your email
            </h1>
            <p className="text-gray-600">
              If an account exists with this email, you&apos;ll receive a password reset link at
            </p>
            <p className="text-gray-900 font-medium mt-1">
              {submittedEmail}
            </p>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className={cn(
              "flex items-center justify-center gap-2 w-full h-12 px-4",
              "bg-indigo-400 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2",
              "transition-all duration-150"
            )}
          >
            Back to sign in
          </Link>

          {/* Resend Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
            >
              Click to resend
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AuthEmailField
              control={form.control}
              name="email"
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AuthSubmitButton isLoading={isLoading} loadingText="Sending...">
              Send reset link
            </AuthSubmitButton>
          </form>
        </Form>
      </div>
    </div>
  )
}
