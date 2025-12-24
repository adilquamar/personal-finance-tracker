"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <Logo />

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hidden sm:flex text-gray-700 hover:bg-gray-100">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5">
            <Link href="/signup">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

