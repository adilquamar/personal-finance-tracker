"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { signIn, signInWithOAuth } from "@/app/actions/auth"
import {
  AuthDivider,
  SocialAuthButtons,
  AuthEmailField,
  AuthPasswordField,
  AuthSubmitButton,
} from "@/components/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(data)
      
      if (result.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsOAuthLoading(true)
    setError(null)

    try {
      const result = await signInWithOAuth("google")
      
      if ("url" in result) {
        window.location.href = result.url
      } else {
        setError(result.error)
        setIsOAuthLoading(false)
      }
    } catch {
      setError("Failed to sign in with Google. Please try again.")
      setIsOAuthLoading(false)
    }
  }

  const isDisabled = isLoading || isOAuthLoading

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
            Sign in to your account
          </h1>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AuthEmailField
              control={form.control}
              name="email"
              disabled={isDisabled}
            />

            <AuthPasswordField
              control={form.control}
              name="password"
              disabled={isDisabled}
              showForgotLink
              autoComplete="current-password"
            />

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AuthSubmitButton isLoading={isLoading} disabled={isDisabled} loadingText="Signing in...">
              Sign in
            </AuthSubmitButton>
          </form>
        </Form>

        {/* Divider */}
        <AuthDivider className="my-6" />

        {/* Social Auth */}
        <SocialAuthButtons
          mode="signin"
          onGoogleClick={handleGoogleSignIn}
          disabled={isDisabled}
        />

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            New to FinanceTracker?{" "}
            <Link
              href="/signup"
              className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
