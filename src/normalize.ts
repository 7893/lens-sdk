/**
 * Score Normalization
 *
 * Normalizes scores from multiple search sources into a unified 0-1 range,
 * making them comparable before fusion or re-ranking.
 */

export interface ScoredItem {
  id: string;
  score: number;
}

/**
 * Min-max normalizes a list of scored items to [0, 1].
 *
 * If all scores are equal, returns 1.0 for all items.
 *
 * @example
 * normalizeScores([{ id: 'a', score: 10 }, { id: 'b', score: 5 }])
 * // => [{ id: 'a', score: 1.0 }, { id: 'b', score: 0.0 }]
 */
export function normalizeScores(items: ScoredItem[]): ScoredItem[] {
  if (items.length === 0) return [];

  const scores = items.map((i) => i.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;

  return items.map((item) => ({
    ...item,
    score: range === 0 ? 1.0 : (item.score - min) / range,
  }));
}

/**
 * Clamps all scores to [0, 1] without rescaling.
 * Useful when scores are already roughly in range but may exceed bounds.
 */
export function clampScores(items: ScoredItem[]): ScoredItem[] {
  return items.map((item) => ({
    ...item,
    score: Math.min(1, Math.max(0, item.score)),
  }));
}
