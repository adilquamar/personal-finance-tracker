"use client"

import { Send } from "lucide-react"
import { AI_CONSTANTS } from "@/lib/config/ai-constants"

interface ChatInputProps {
  input: string
  isLoading: boolean
  isRateLimited: boolean
  remainingMessages: number
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function ChatInput({
  input,
  isLoading,
  isRateLimited,
  remainingMessages,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const isDisabled = isLoading || isRateLimited || !input.trim()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isDisabled) {
        const form = e.currentTarget.form
        if (form) {
          form.requestSubmit()
        }
      }
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={onSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isRateLimited
                ? "Daily message limit reached. Try again tomorrow."
                : "Ask about your finances..."
            }
            disabled={isRateLimited}
            rows={1}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-100 disabled:text-gray-500"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isDisabled}
          className="flex-shrink-0 w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-400 text-center">
        {isRateLimited ? (
          <span className="text-red-500">
            Daily message limit reached. Try again tomorrow.
          </span>
        ) : (
          <span>
            {remainingMessages} of {AI_CONSTANTS.dailyMessageLimit} messages
            remaining today
          </span>
        )}
      </div>
    </div>
  )
}
