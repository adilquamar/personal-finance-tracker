"use server"

import { revalidatePath } from "next/cache"
import {
  withAuth,
  withAuthQuery,
  withAuthQueryNoInput,
  withAuthNoInput,
} from "@/lib/auth"
import type { Conversation, Message } from "@/types/chat"
import type { ActionResult } from "@/types/common"

/**
 * Gets all conversations for the authenticated user.
 *
 * @returns Array of conversations ordered by updated_at descending
 */
export const getConversations = withAuthQueryNoInput<Conversation[]>(
  async ({ user, supabase }) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching conversations:", error.message)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching conversations:", error)
      return []
    }
  },
  []
)

/**
 * Creates a new conversation for the authenticated user.
 *
 * @returns Success with the created conversation or error message
 */
export const createConversation = withAuthNoInput<Conversation>(
  async ({ user, supabase }) => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          title: "New Chat",
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating conversation:", error.message)
        return { success: false, error: "Failed to create conversation. Please try again." }
      }

      revalidatePath("/chatbot")

      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error creating conversation:", error)
      return { success: false, error: "An unexpected error occurred. Please try again." }
    }
  },
  { errorMessage: "You must be logged in to create a conversation" }
)

/**
 * Gets all messages for a conversation.
 * Verifies that the conversation belongs to the authenticated user.
 *
 * @param conversationId - The ID of the conversation
 * @returns Array of messages ordered by created_at ascending
 */
export const getConversationMessages = withAuthQuery<string, Message[]>(
  async ({ user, supabase }, conversationId) => {
    try {
      // First verify the conversation belongs to the user
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single()

      if (convError || !conversation) {
        console.error("Conversation not found or unauthorized:", convError?.message)
        return []
      }

      // Fetch messages for the conversation
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error.message)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching messages:", error)
      return []
    }
  },
  []
)

/**
 * Deletes a conversation and all its messages (via cascade).
 * Verifies that the conversation belongs to the authenticated user.
 *
 * @param conversationId - The ID of the conversation to delete
 * @returns Success or error message
 */
export const deleteConversation = withAuth<string, null>(
  async ({ user, supabase }, conversationId) => {
    try {
      // Delete the conversation (messages will cascade delete)
      // RLS policy ensures only owner can delete
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error deleting conversation:", error.message)
        return { success: false, error: "Failed to delete conversation. Please try again." }
      }

      revalidatePath("/chatbot")

      return { success: true, data: null }
    } catch (error) {
      console.error("Unexpected error deleting conversation:", error)
      return { success: false, error: "An unexpected error occurred. Please try again." }
    }
  },
  { errorMessage: "You must be logged in to delete a conversation" }
)

/**
 * Input type for renaming a conversation
 */
interface RenameConversationInput {
  conversationId: string
  title: string
}

/**
 * Renames a conversation.
 * Verifies that the conversation belongs to the authenticated user.
 *
 * @param input - Object containing conversationId and new title
 * @returns Success with the updated conversation or error message
 */
export const renameConversation = withAuth<RenameConversationInput, Conversation>(
  async ({ user, supabase }, { conversationId, title }) => {
    try {
      // Validate title
      const trimmedTitle = title.trim()
      if (!trimmedTitle) {
        return { success: false, error: "Title cannot be empty" }
      }

      if (trimmedTitle.length > 100) {
        return { success: false, error: "Title must be 100 characters or less" }
      }

      // Update the conversation
      // RLS policy ensures only owner can update
      const { data, error } = await supabase
        .from("conversations")
        .update({
          title: trimmedTitle,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Error renaming conversation:", error.message)
        return { success: false, error: "Failed to rename conversation. Please try again." }
      }

      if (!data) {
        return { success: false, error: "Conversation not found" }
      }

      revalidatePath("/chatbot")

      return { success: true, data }
    } catch (error) {
      console.error("Unexpected error renaming conversation:", error)
      return { success: false, error: "An unexpected error occurred. Please try again." }
    }
  },
  { errorMessage: "You must be logged in to rename a conversation" }
)
