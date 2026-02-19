"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./message-bubble"
import { SuggestedPrompts } from "./suggested-prompts"
import type { Message } from "ai"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onSelectPrompt: (prompt: string) => void
}

export function ChatMessages({
  messages,
  isLoading,
  onSelectPrompt,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <SuggestedPrompts onSelect={onSelectPrompt} />
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role as "user" | "assistant"}
          content={message.content}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
