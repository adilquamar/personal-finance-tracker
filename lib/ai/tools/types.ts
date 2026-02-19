import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

export type ToolContext = {
  supabase: SupabaseClient<Database>
  userId: string
}
