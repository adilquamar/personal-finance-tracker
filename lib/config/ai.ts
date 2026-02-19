import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { AI_CONSTANTS } from "./ai-constants"

/**
 * Admin-controlled AI model configuration.
 * Change these values to control the LLM for all users.
 * The AI_MODEL env var overrides the default.
 */

const AI_DEFAULTS = {
  provider: "openai" as const,
  model: "gpt-4o-mini",
  maxTokens: 2048,
  temperature: 0.7,
  dailyMessageLimit: AI_CONSTANTS.dailyMessageLimit,
}

const providers = {
  openai: (model: string) => openai(model),
  anthropic: (model: string) => anthropic(model),
  google: (model: string) => google(model),
}

/**
 * Returns the configured AI model instance.
 * Supports env var override via AI_MODEL in format "provider:model"
 * e.g. "openai:gpt-4o" or "anthropic:claude-3-haiku-20240307"
 */
export function getModel() {
  const override = process.env.AI_MODEL

  if (override) {
    const [providerName, modelId] = override.split(":")
    const providerFn = providers[providerName as keyof typeof providers]

    if (providerFn && modelId) {
      return providerFn(modelId)
    }

    console.warn(
      `Invalid AI_MODEL format "${override}". Expected "provider:model". Falling back to default.`
    )
  }

  return providers[AI_DEFAULTS.provider](AI_DEFAULTS.model)
}

export const aiConfig = { ...AI_DEFAULTS }
