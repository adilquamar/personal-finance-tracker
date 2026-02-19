import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-indigo-500 text-white"
            : "bg-white text-gray-900 shadow-sm"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  )
}
