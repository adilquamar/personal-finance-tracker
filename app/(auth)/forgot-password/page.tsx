"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      // TODO: Implement actual password reset with Supabase
      console.log("Password reset requested for:", data.email)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
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
              We sent a password reset link to
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
              onClick={() => setIsSubmitted(false)}
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
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email
                  </FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                      className={cn(
                        "flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm",
                        "placeholder:text-gray-400",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-indigo-300",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-all duration-150",
                        form.formState.errors.email
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                          : "border-gray-200"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
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
                  Sending...
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  )
}

