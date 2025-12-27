"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { signIn } from "@/app/actions/auth"
import { useAuthForm } from "@/lib/hooks/use-auth-form"
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
  const searchParams = useSearchParams()
  const {
    isLoading,
    error,
    isDisabled,
    setError,
    handleGoogleAuth,
    handleSubmit,
  } = useAuthForm({
    oauthErrorMessage: "Failed to sign in with Google. Please try again.",
  })

  // Show errors from OAuth callback or other redirects
  useEffect(() => {
    const callbackError = searchParams.get("error")
    if (callbackError) {
      setError(callbackError)
    }
  }, [searchParams, setError])

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit<LoginFormData>((data) => {
    const redirectTo = searchParams.get("redirectTo") || "/dashboard"
    return signIn(data, redirectTo)
  })

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
          onGoogleClick={handleGoogleAuth}
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
