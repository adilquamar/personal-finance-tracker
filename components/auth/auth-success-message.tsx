"use client"

import Link from "next/link"
import { Check, type LucideIcon } from "lucide-react"

interface AuthSuccessMessageProps {
  /** Icon to display (defaults to Check) */
  icon?: LucideIcon
  /** Icon variant: "success" (green) or "info" (indigo) */
  variant?: "success" | "info"
  /** Main heading text */
  title: string
  /** Message body (can include the email if relevant) */
  message: React.ReactNode
  /** Link text */
  linkText: string
  /** Link destination */
  linkHref: string
}

export function AuthSuccessMessage({
  icon: Icon = Check,
  variant = "success",
  title,
  message,
  linkText,
  linkHref,
}: AuthSuccessMessageProps) {
  const iconStyles = {
    success: "bg-green-100 text-green-600",
    info: "bg-indigo-50 text-indigo-500",
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 sm:p-10">
        <div className="text-center">
          <div
            className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-6 ${iconStyles[variant]}`}
          >
            <Icon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3">
            {title}
          </h1>
          <div className="text-gray-600 mb-6">{message}</div>
          <Link
            href={linkHref}
            className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  )
}

