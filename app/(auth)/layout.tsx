import { Logo } from "@/components/shared/logo"
import "./auth.css"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Background */}
      <div className="auth-gradient-bg fixed inset-0 -z-10" />
      <div className="auth-base-layer fixed inset-0 -z-10 bg-gray-50" />

      {/* Decorative gradient shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="auth-blob-purple absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30" />
        <div className="auth-blob-pink absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full opacity-25" />
        <div className="auth-blob-cyan absolute -bottom-40 right-1/4 w-[700px] h-[700px] rounded-full opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-6">
        <Logo size="md" href="/" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 px-6">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <span>© FinanceTracker</span>
          <a href="#" className="hover:text-gray-700 transition-colors">
            Privacy & terms
          </a>
        </div>
      </footer>
    </div>
  )
}
