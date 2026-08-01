/**
 * Reciprocal Rank Fusion (RRF)
 *
 * Merges two ranked result lists (e.g. FTS + vector search) into a single
 * deduplicated ranking. Extracted from the Lens SearchService hybrid pipeline.
 *
 * Reference: Cormack, Clarke & Buettcher (2009)
 */

export interface RRFInput {
  id: string;
  score?: number;
}

export interface RRFResult {
  id: string;
  score: number;
  source: 'fts' | 'vector' | 'both';
}

/**
 * Fuses two ranked lists using Reciprocal Rank Fusion.
 *
 * @param ftsResults   Results from keyword/FTS search, ordered by relevance
 * @param vectorResults Results from vector/semantic search, ordered by score
 * @param k            RRF constant (default 60, per the original paper)
 * @returns Merged and re-ranked result list, deduplicated
 *
 * @example
 * const merged = rrfRank(
 *   [{ id: 'a' }, { id: 'b' }],
 *   [{ id: 'b', score: 0.9 }, { id: 'c', score: 0.7 }]
 * )
 * // => [{ id: 'b', score: ..., source: 'both' }, ...]
 */
export function rrfRank(
  ftsResults: RRFInput[],
  vectorResults: RRFInput[],
  k = 60,
): RRFResult[] {
  const scores = new Map<string, { rrf: number; source: 'fts' | 'vector' | 'both' }>();

  // Accumulate RRF score from FTS list
  ftsResults.forEach((item, i) => {
    const rrf = 1 / (k + i + 1);
    scores.set(item.id, { rrf, source: 'fts' });
  });

  // Accumulate RRF score from vector list
  vectorResults.forEach((item, i) => {
    const rrf = 1 / (k + i + 1);
    const existing = scores.get(item.id);
    if (existing) {
      scores.set(item.id, {
        rrf: existing.rrf + rrf,
        source: 'both',
      });
    } else {
      scores.set(item.id, { rrf, source: 'vector' });
    }
  });

  // Sort by descending RRF score
  return Array.from(scores.entries())
    .map(([id, { rrf, source }]) => ({ id, score: rrf, source }))
    .sort((a, b) => b.score - a.score);
}
