"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"
import { AuthDivider, SocialAuthButtons, PasswordInput } from "@/components/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
    },
  })

  const password = form.watch("password", "")

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement actual sign-up with Supabase
      console.log("Signup attempt:", data)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    // TODO: Implement Google OAuth with Supabase
    console.log("Google sign-up clicked")
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

        {/* Social Auth - First on signup (like Stripe) */}
        <SocialAuthButtons
          mode="signup"
          onGoogleClick={handleGoogleSignUp}
          disabled={isLoading}
        />

        {/* Divider */}
        <AuthDivider className="my-6" />

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

            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      autoComplete="name"
                      disabled={isLoading}
                      {...field}
                      className={cn(
                        "flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-sm",
                        "placeholder:text-gray-400",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:border-indigo-300",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-all duration-150",
                        form.formState.errors.fullName
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                          : "border-gray-200"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                      className={cn(
                        form.formState.errors.password
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                          : ""
                      )}
                    />
                  </FormControl>

                  {/* Password Strength Indicators */}
                  {password.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <PasswordCheck passed={passwordChecks.length} text="At least 8 characters" />
                      <PasswordCheck passed={passwordChecks.uppercase} text="One uppercase letter" />
                      <PasswordCheck passed={passwordChecks.lowercase} text="One lowercase letter" />
                      <PasswordCheck passed={passwordChecks.number} text="One number" />
                    </div>
                  )}

                  {!password && <FormMessage className="text-sm text-red-500" />}
                </FormItem>
              )}
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

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
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
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

function PasswordCheck({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center w-4 h-4 rounded-full transition-colors",
          passed ? "bg-green-500" : "bg-gray-200"
        )}
      >
        {passed && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={cn(
          "text-xs transition-colors",
          passed ? "text-green-600" : "text-gray-500"
        )}
      >
        {text}
      </span>
    </div>
  )
}

