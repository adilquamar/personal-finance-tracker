import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { AppHeaderClient } from "@/components/shared"
import { getSupabaseUser } from "@/lib/auth"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FinanceTracker | Personal Finance Tracking App",
  description: "Track your expenses, view analytics, and get AI-powered insights to manage your personal finances.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSupabaseUser()

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppHeaderClient user={user} />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
