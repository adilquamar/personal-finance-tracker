import { requireAuth } from "@/lib/auth"
import { getConversations } from "@/app/actions/chat"
import { ChatbotPageContent } from "@/components/chatbot/chatbot-page-content"

export default async function ChatbotPage() {
  await requireAuth()
  const conversations = await getConversations()

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ChatbotPageContent initialConversations={conversations} />
    </div>
  )
}
