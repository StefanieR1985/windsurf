// AI provider registry - one place to resolve a model, so API routes and
// scripts share the same configuration. Every provider is returned through the
// Vercel AI SDK, so call sites can swap providers without changing their code.
//
// Server-side only: the API keys below must never reach the browser.
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogle } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createPerplexity } from '@ai-sdk/perplexity';
import type { LanguageModel } from 'ai';

export type AiProvider =
  | 'claude'      // Anthropic - Standard fuer Texte und Auswertungen
  | 'gpt'         // OpenAI
  | 'gemini'      // Google
  | 'perplexity'  // Recherche mit Quellenangaben
  | 'kimi'        // Moonshot AI, OpenAI-kompatibel
  | 'local';      // Ollama auf dem eigenen Rechner - keine Daten nach aussen

// Environment variable that holds the key for each provider. Ollama runs
// locally and needs none.
const API_KEY_ENV: Record<AiProvider, string | null> = {
  claude: 'ANTHROPIC_API_KEY',
  gpt: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
  perplexity: 'PERPLEXITY_API_KEY',
  kimi: 'MOONSHOT_API_KEY',
  local: null,
};

// Defaults can be overridden per environment - see .env.example.
export const DEFAULT_MODELS: Record<AiProvider, string> = {
  claude: process.env.CLAUDE_MODEL ?? 'claude-opus-5',
  gpt: process.env.OPENAI_MODEL ?? 'gpt-5.6',
  gemini: process.env.GEMINI_MODEL ?? 'gemini-3.7-flash',
  perplexity: process.env.PERPLEXITY_MODEL ?? 'sonar-pro',
  kimi: process.env.MOONSHOT_MODEL ?? 'kimi-latest',
  local: process.env.OLLAMA_MODEL ?? 'llama3.2',
};

const MOONSHOT_BASE_URL = process.env.MOONSHOT_BASE_URL ?? 'https://api.moonshot.ai/v1';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1';

function requireKey(provider: AiProvider): string {
  const envName = API_KEY_ENV[provider];
  const value = envName ? process.env[envName] : undefined;
  if (!value) {
    throw new Error(
      `${envName} fehlt. Key in .env.local eintragen (Vorlage: .env.example).`,
    );
  }
  return value;
}

/**
 * Returns a model for the given provider. Throws when the provider needs an API
 * key that is not configured.
 *
 *   const model = getModel('claude');
 *   const { text } = await generateText({ model, prompt: 'Hallo' });
 */
export function getModel(
  provider: AiProvider = 'claude',
  modelId: string = DEFAULT_MODELS[provider],
): LanguageModel {
  if (typeof window !== 'undefined') {
    throw new Error('getModel() darf nur auf dem Server laufen - API-Keys gehoeren nicht in den Browser.');
  }

  switch (provider) {
    case 'claude':
      return createAnthropic({ apiKey: requireKey('claude') })(modelId);
    case 'gpt':
      return createOpenAI({ apiKey: requireKey('gpt') })(modelId);
    case 'gemini':
      return createGoogle({ apiKey: requireKey('gemini') })(modelId);
    case 'perplexity':
      return createPerplexity({ apiKey: requireKey('perplexity') })(modelId);
    case 'kimi':
      // Moonshot speaks the OpenAI API, so the compatible provider is enough.
      return createOpenAICompatible({
        name: 'moonshot',
        baseURL: MOONSHOT_BASE_URL,
        apiKey: requireKey('kimi'),
      })(modelId);
    case 'local':
      // Ollama also exposes an OpenAI-compatible endpoint; the key is ignored.
      return createOpenAICompatible({
        name: 'ollama',
        baseURL: OLLAMA_BASE_URL,
        apiKey: 'ollama',
      })(modelId);
  }
}

/** Providers whose API key is configured - useful for a health check page. */
export function availableProviders(): AiProvider[] {
  return (Object.keys(API_KEY_ENV) as AiProvider[]).filter((provider) => {
    const envName = API_KEY_ENV[provider];
    return envName === null || Boolean(process.env[envName]);
  });
}
