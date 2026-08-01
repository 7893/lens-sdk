/**
 * @7893/lens-sdk
 *
 * Hybrid search toolkit extracted from the Lens visual intelligence engine.
 * Framework-agnostic — works with any FTS + vector search stack.
 */

export { rrfRank } from './rrf';
export type { RRFInput, RRFResult } from './rrf';

export { dynamicCutoff } from './cutoff';
export type { ScoredItem, CutoffOptions } from './cutoff';

export { normalizeScores, clampScores } from './normalize';

export { buildQueryPrompt } from './prompt';
export type { QueryPromptOptions } from './prompt';

export { deduplicateResults, wrapSearchResponse, paginateResults } from './result';
export type { SearchResult, ParsedSearchResponse } from './result';
