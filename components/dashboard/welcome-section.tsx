interface WelcomeSectionProps {
  fullName?: string | null
}

export function WelcomeSection({ fullName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-medium text-gray-900 mb-2">
        Welcome back{fullName ? `, ${fullName}` : ""}!
      </h1>
      <p className="text-gray-500">
        Here&apos;s an overview of your financial activity.
      </p>
    </div>
  )
}

