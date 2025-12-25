"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import { signUp, signInWithOAuth } from "@/app/actions/auth"
import {
  AuthDivider,
  SocialAuthButtons,
  AuthEmailField,
  AuthTextField,
  AuthPasswordWithStrength,
  AuthSubmitButton,
  AuthSuccessMessage,
} from "@/components/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  })

  const password = form.watch("password", "")

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const result = await signUp(data)
      
      if (result.success) {
        if (result.message?.includes("verify") || result.message?.includes("check your email")) {
          setSuccessMessage(result.message)
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      } else {
        setError(result.error)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
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
      setError("Failed to sign up with Google. Please try again.")
      setIsOAuthLoading(false)
    }
  }

  const isDisabled = isLoading || isOAuthLoading

  // Show success message if email confirmation is required
  if (successMessage) {
    return (
      <AuthSuccessMessage
        variant="success"
        title="Check your email"
        message={successMessage}
        linkText="Back to sign in"
        linkHref="/login"
      />
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2">
            Create your account
          </h1>
        </div>

        {/* Social Auth - First on signup */}
        <SocialAuthButtons
          mode="signup"
          onGoogleClick={handleGoogleSignUp}
          disabled={isDisabled}
        />

        {/* Divider */}
        <AuthDivider className="my-6" />

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <AuthEmailField
              control={form.control}
              name="email"
              disabled={isDisabled}
            />

            <AuthTextField
              control={form.control}
              name="fullName"
              label="Full name"
              autoComplete="name"
              disabled={isDisabled}
            />

            <AuthPasswordWithStrength
              control={form.control}
              name="password"
              disabled={isDisabled}
              password={password}
            />

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AuthSubmitButton isLoading={isLoading} disabled={isDisabled} loadingText="Creating account...">
              Create account
            </AuthSubmitButton>
          </form>
        </Form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
