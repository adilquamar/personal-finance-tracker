import Link from "next/link"

interface QuickActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  comingSoon?: boolean
}

export function QuickActionCard({
  icon,
  title,
  description,
  href,
  comingSoon = false,
}: QuickActionCardProps) {
  if (comingSoon) {
    return (
      <div className="relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 cursor-not-allowed">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-400">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full">
          Soon
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group"
    >
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  )
}

