/**
 * Query Prompt Builder
 *
 * Generates LLM prompts for query expansion and translation.
 * Extracted from the Lens semantic search pipeline.
 */

export interface QueryPromptOptions {
  /**
   * Max words in the expanded output (default: 30).
   * Only applies when the query is short (<= shortQueryThreshold words).
   */
  maxWords?: number;
  /**
   * Queries with this many words or fewer get expansion (default: 4).
   * Longer queries get translation only.
   */
  shortQueryThreshold?: number;
}

/**
 * Builds a prompt that instructs an LLM to:
 * - Translate the query to English if needed
 * - Expand short queries into a descriptive scene
 *
 * Designed for use with any text generation model (OpenAI, Workers AI, etc.)
 *
 * @example
 * buildQueryPrompt('东京夜景')
 * // => "Translate to English if not English, then expand into a descriptive scene (max 30 words): 东京夜景"
 *
 * buildQueryPrompt('a long descriptive query about mountain landscapes at dawn')
 * // => "Translate to English if not English: a long descriptive..."
 */
export function buildQueryPrompt(query: string, options: QueryPromptOptions = {}): string {
  const { maxWords = 30, shortQueryThreshold = 4 } = options;
  const wordCount = query.trim().split(/\s+/).length;

  if (wordCount <= shortQueryThreshold) {
    return `Translate to English if not English, then expand into a descriptive scene (max ${maxWords} words): ${query}`;
  }

  return `Translate to English if not English: ${query}`;
}
