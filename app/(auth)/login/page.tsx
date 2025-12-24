"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { AuthDivider, SocialAuthButtons, PasswordInput } from "@/components/auth"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
      // TODO: Implement actual sign-in with Supabase
      console.log("Login attempt:", data)
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google OAuth with Supabase
    console.log("Google sign-in clicked")
  }

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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                      className={cn(
                        form.formState.errors.password
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-300"
                          : ""
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </Form>

        {/* Divider */}
        <AuthDivider className="my-6" />

        {/* Social Auth */}
        <SocialAuthButtons
          mode="signin"
          onGoogleClick={handleGoogleSignIn}
          disabled={isLoading}
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

