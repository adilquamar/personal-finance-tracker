"use client"

import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/chat"

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation: (id: string) => void
}

function groupConversationsByDate(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  const groups: Record<string, Conversation[]> = {}
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  for (const conversation of conversations) {
    const date = new Date(conversation.updated_at)
    const conversationDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )

    let group: string
    if (conversationDate >= today) {
      group = "Today"
    } else if (conversationDate >= yesterday) {
      group = "Yesterday"
    } else if (conversationDate >= lastWeek) {
      group = "Last 7 days"
    } else {
      group = "Older"
    }

    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(conversation)
  }

  return groups
}

const GROUP_ORDER = ["Today", "Yesterday", "Last 7 days", "Older"]

export function ConversationSidebar({
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: ConversationSidebarProps) {
  const groupedConversations = groupConversationsByDate(conversations)

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between lg:justify-center">
          <Button onClick={onNewChat} className="flex-1 lg:w-full">
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
          <button
            onClick={onClose}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No conversations yet
          </p>
        ) : (
          GROUP_ORDER.map((group) => {
            const items = groupedConversations[group]
            if (!items || items.length === 0) return null

            return (
              <div key={group} className="mb-4">
                <p className="text-xs text-gray-400 font-medium px-3 py-2">
                  {group}
                </p>
                <div className="space-y-1">
                  {items.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-3 cursor-pointer transition-colors",
                        activeConversationId === conversation.id
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-gray-50 text-gray-700"
                      )}
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      <span className="text-sm truncate flex-1 mr-2">
                        {conversation.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conversation.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                        aria-label="Delete conversation"
                      >
                        <Trash2 size={14} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-full sm:w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-gray-200 bg-white">
        {sidebarContent}
      </div>
    </>
  )
}
