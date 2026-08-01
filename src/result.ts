/**
 * Search Result Utilities
 *
 * Helpers for standardizing, deduplicating, and paginating search results
 * from hybrid pipelines.
 */

export interface SearchResult {
  id: string;
  score: number;
  [key: string]: unknown;
}

export interface ParsedSearchResponse<T extends SearchResult> {
  results: T[];
  total: number;
  took: number;
}

/**
 * Deduplicates a result list by id, keeping the highest-scoring entry.
 *
 * @example
 * deduplicateResults([{ id: 'a', score: 0.9 }, { id: 'a', score: 0.7 }])
 * // => [{ id: 'a', score: 0.9 }]
 */
export function deduplicateResults<T extends SearchResult>(results: T[]): T[] {
  const seen = new Map<string, T>();
  for (const item of results) {
    const existing = seen.get(item.id);
    if (!existing || item.score > existing.score) {
      seen.set(item.id, item);
    }
  }
  return Array.from(seen.values());
}

/**
 * Wraps a result array into a standard search response envelope,
 * including total count and elapsed time.
 *
 * @param results  Final result array
 * @param startTime  Date.now() value from when the search began
 *
 * @example
 * const response = wrapSearchResponse(results, startTime)
 * // => { results: [...], total: 12, took: 43 }
 */
export function wrapSearchResponse<T extends SearchResult>(
  results: T[],
  startTime: number,
): ParsedSearchResponse<T> {
  return {
    results,
    total: results.length,
    took: Date.now() - startTime,
  };
}

/**
 * Paginates a result array.
 *
 * @param results  Full result array
 * @param page     1-based page number
 * @param pageSize Number of items per page (default: 20)
 *
 * @example
 * paginateResults(results, 2, 10)
 * // => items 11-20
 */
export function paginateResults<T>(results: T[], page: number, pageSize = 20): T[] {
  const start = (page - 1) * pageSize;
  return results.slice(start, start + pageSize);
}
