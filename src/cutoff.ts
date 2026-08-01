/**
 * Dynamic Score Cutoff
 *
 * Automatically determines how many results to keep from a scored list
 * without needing a hardcoded threshold. Uses relative ratio, absolute
 * floor, and cliff detection. Extracted from the Lens SearchService.
 */

export interface CutoffOptions {
  /** Maximum results to return (default: 100) */
  maxResults?: number;
  /** Minimum score to keep a result (default: 0.4) */
  absoluteFloor?: number;
  /** Keep results scoring >= this fraction of the max vector score (default: 0.75) */
  relativeRatio?: number;
  /** Drop results when score falls more than this in one step (default: 0.06) */
  cliffDrop?: number;
  /** Only apply cliff detection below this score (default: 0.45) */
  cliffFloor?: number;
}

export interface ScoredItem {
  id: string;
  score: number;
}

/**
 * Returns the number of results to keep from a scored list.
 *
 * FTS results (score === 1.0) are always kept.
 * Vector results are trimmed based on score distribution.
 *
 * @param results  Items sorted by descending score
 * @param options  Tuning parameters (all optional)
 * @returns Number of items to keep (use as: results.slice(0, cutoff))
 *
 * @example
 * const n = dynamicCutoff(results)
 * const trimmed = results.slice(0, n)
 */
export function dynamicCutoff(results: ScoredItem[], options: CutoffOptions = {}): number {
  const {
    maxResults = 100,
    absoluteFloor = 0.4,
    relativeRatio = 0.75,
    cliffDrop = 0.06,
    cliffFloor = 0.45,
  } = options;

  if (results.length === 0) return 0;

  // Relative threshold derived from vector scores only (exclude FTS score=1.0)
  const vectorScores = results.filter((r) => r.score < 0.99).map((r) => r.score);
  const maxVector = vectorScores.length > 0 ? Math.max(...vectorScores) : 0.5;
  const relativeThreshold = maxVector * relativeRatio;

  for (let i = 1; i < results.length && i < maxResults; i++) {
    const score = results[i].score;
    const prevScore = results[i - 1].score;
    const drop = prevScore - score;

    // Always keep FTS results
    if (score >= 0.99) continue;

    if (score < absoluteFloor) return i;
    if (score < relativeThreshold) return i;
    if (drop > cliffDrop && score < cliffFloor) return i;
  }

  return Math.min(results.length, maxResults);
}
