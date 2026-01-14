"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import { signUp } from "@/app/actions/auth"
import { useAuthForm } from "@/lib/hooks/use-auth-form"
import {
  AuthDivider,
  SocialAuthButtons,
  AuthEmailField,
  AuthTextField,
  AuthPasswordWithStrength,
  AuthSubmitButton,
  TurnstileCaptcha,
} from "@/components/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"

export default function SignupPage() {
  const [captchaToken, setCaptchaToken] = useState<string>()
  
  const {
    isLoading,
    error,
    isDisabled,
    setError,
    handleGoogleAuth,
    handleSubmit,
  } = useAuthForm({
    oauthErrorMessage: "Failed to sign up with Google. Please try again.",
  })

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  })

  const password = form.watch("password", "")

  const handleCaptchaSuccess = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken(undefined)
    setError("CAPTCHA verification failed. Please try again.")
  }, [setError])

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(undefined)
  }, [])

  const onSubmit = handleSubmit<SignupFormData>((data) => {
    // Include captcha token in form data
    return signUp({ ...data, captchaToken })
  })

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
          onGoogleClick={handleGoogleAuth}
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

            {/* CAPTCHA */}
            <TurnstileCaptcha
              onSuccess={handleCaptchaSuccess}
              onError={handleCaptchaError}
              onExpire={handleCaptchaExpire}
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
