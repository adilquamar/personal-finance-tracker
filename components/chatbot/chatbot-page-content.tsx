"use client"

import { useState, useCallback, useEffect } from "react"
import { useChat } from "ai/react"
import { Menu } from "lucide-react"
import { ConversationSidebar } from "./conversation-sidebar"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import {
  createConversation,
  getConversationMessages,
  deleteConversation,
} from "@/app/actions/chat"
import { AI_CONSTANTS } from "@/lib/config/ai-constants"
import type { Conversation } from "@/types/chat"

interface ChatbotPageContentProps {
  initialConversations: Conversation[]
}

export function ChatbotPageContent({
  initialConversations,
}: ChatbotPageContentProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
    body: { conversationId: activeConversationId },
    onFinish: () => {
      setMessageCount((prev) => prev + 1)
    },
    onError: (error) => {
      if (error.message.includes("429") || error.message.includes("limit")) {
        setIsRateLimited(true)
      }
    },
  })

  const remainingMessages = Math.max(
    0,
    AI_CONSTANTS.dailyMessageLimit - messageCount
  )

  const loadConversationMessages = useCallback(async (conversationId: string) => {
    const dbMessages = await getConversationMessages(conversationId)
    setMessages(
      dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }))
    )
    setMessageCount(dbMessages.filter((m) => m.role === "user").length)
  }, [setMessages])

  const handleSelectConversation = useCallback(
    async (id: string) => {
      setActiveConversationId(id)
      setSidebarOpen(false)
      await loadConversationMessages(id)
    },
    [loadConversationMessages]
  )

  const handleNewChat = useCallback(async () => {
    const result = await createConversation()
    if (result.success && result.data) {
      setConversations((prev) => [result.data, ...prev])
      setActiveConversationId(result.data.id)
      setMessages([])
      setSidebarOpen(false)
    }
  }, [setMessages])

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      const result = await deleteConversation(id)
      if (result.success) {
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (activeConversationId === id) {
          setActiveConversationId(null)
          setMessages([])
        }
      }
    },
    [activeConversationId, setMessages]
  )

  const handleSelectPrompt = useCallback(
    async (prompt: string) => {
      if (!activeConversationId) {
        const result = await createConversation()
        if (result.success && result.data) {
          setConversations((prev) => [result.data, ...prev])
          setActiveConversationId(result.data.id)
          setInput(prompt)
        }
      } else {
        setInput(prompt)
      }
    },
    [activeConversationId, setInput]
  )

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim()) return

      if (!activeConversationId) {
        const result = await createConversation()
        if (result.success && result.data) {
          setConversations((prev) => [result.data, ...prev])
          setActiveConversationId(result.data.id)
          setTimeout(() => {
            handleSubmit(e)
          }, 0)
        }
      } else {
        handleSubmit(e)
      }
    },
    [activeConversationId, input, handleSubmit]
  )

  useEffect(() => {
    if (
      activeConversationId &&
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant"
    ) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, updated_at: new Date().toISOString() }
            : c
        )
      )
    }
  }, [messages, activeConversationId])

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Mobile header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Open conversations"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            {activeConversationId
              ? conversations.find((c) => c.id === activeConversationId)
                  ?.title || "Chat"
              : "New Chat"}
          </h1>
        </div>

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onSelectPrompt={handleSelectPrompt}
        />

        <ChatInput
          input={input}
          isLoading={isLoading}
          isRateLimited={isRateLimited}
          remainingMessages={remainingMessages}
          onInputChange={handleInputChange}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  )
}
