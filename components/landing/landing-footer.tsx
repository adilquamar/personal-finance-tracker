import Link from "next/link"
import { Logo } from "@/components/shared/logo"

interface FooterLink {
  label: string
  href: string
}

interface LandingFooterProps {
  links?: FooterLink[]
}

const defaultFooterLinks: FooterLink[] = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
]

export function LandingFooter({ links = defaultFooterLinks }: LandingFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          
          {links.length > 0 && (
            <div className="flex items-center gap-6 text-sm text-gray-500">
              {links.map((link) => (
                <Link 
                  key={link.href + link.label}
                  href={link.href} 
                  className="hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            © {currentYear} FinanceTracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

