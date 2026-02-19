interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
}

const SUGGESTED_PROMPTS = [
  "What was my biggest expense this month?",
  "How am I doing against my budget?",
  "What are my active subscriptions costing me?",
  "Where should I cut spending?",
]

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          How can I help you today?
        </h2>
        <p className="text-sm text-gray-500">
          Ask me anything about your finances
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 p-4 text-left text-sm text-gray-700 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
