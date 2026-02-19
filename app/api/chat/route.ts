import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { getModel, aiConfig } from "@/lib/config/ai"
import { getSystemPrompt } from "@/lib/ai/system-prompt"
import { createFinancialTools } from "@/lib/ai/tools"

export async function POST(req: Request) {
  // 1. Authenticate via Supabase server client
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // 2. Check daily rate limit
  const { data: messageCount, error: rpcError } = await supabase.rpc(
    "get_daily_message_count",
    { p_user_id: user.id }
  )

  if (rpcError) {
    console.error("Error checking rate limit:", rpcError.message)
  }

  if ((messageCount ?? 0) >= aiConfig.dailyMessageLimit) {
    return Response.json(
      { error: "Daily message limit reached. Try again tomorrow." },
      { status: 429 }
    )
  }

  // 3. Parse request body
  const { messages, conversationId } = await req.json()

  if (!conversationId) {
    return Response.json(
      { error: "conversationId is required" },
      { status: 400 }
    )
  }

  // 4. Save user message to DB
  const lastUserMessage = messages[messages.length - 1]
  if (lastUserMessage?.role === "user") {
    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: lastUserMessage.content,
    })

    if (insertError) {
      console.error("Error saving user message:", insertError.message)
    }
  }

  // 5. Load full conversation history from DB
  const { data: dbMessages, error: messagesError } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (messagesError) {
    console.error("Error loading messages:", messagesError.message)
  }

  // 6. Stream response with AI SDK
  try {
    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(),
      messages: (dbMessages || []) as { role: "user" | "assistant"; content: string }[],
      tools: createFinancialTools(supabase, user.id),
      maxSteps: 5,
      maxTokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
      onFinish: async ({ text }) => {
        // Save assistant message to DB
        if (text) {
          const { error: assistantError } = await supabase
            .from("messages")
            .insert({
              conversation_id: conversationId,
              role: "assistant",
              content: text,
            })

          if (assistantError) {
            console.error(
              "Error saving assistant message:",
              assistantError.message
            )
          }
        }

        // Auto-generate title if this is the first exchange
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conversationId)

        if (count && count <= 2) {
          const title =
            lastUserMessage?.content?.slice(0, 50) || "New Chat"
          await supabase
            .from("conversations")
            .update({ title, updated_at: new Date().toISOString() })
            .eq("id", conversationId)
        } else {
          await supabase
            .from("conversations")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", conversationId)
        }
      },
    })

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Stream error:", error)
        // In development, return the actual error message for debugging
        if (process.env.NODE_ENV === "development") {
          return error instanceof Error ? error.message : String(error)
        }
        return "An error occurred while generating the response."
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to generate response" },
      { status: 500 }
    )
  }
}
