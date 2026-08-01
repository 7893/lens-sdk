import { describe, it, expect } from 'vitest';
import { normalizeScores, clampScores } from '../src/normalize';

describe('normalizeScores', () => {
  it('normalizes to [0, 1]', () => {
    const result = normalizeScores([{ id: 'a', score: 10 }, { id: 'b', score: 5 }, { id: 'c', score: 0 }]);
    expect(result.find((r) => r.id === 'a')?.score).toBe(1.0);
    expect(result.find((r) => r.id === 'c')?.score).toBe(0.0);
    expect(result.find((r) => r.id === 'b')?.score).toBeCloseTo(0.5);
  });

  it('returns 1.0 for all when scores are equal', () => {
    const result = normalizeScores([{ id: 'a', score: 5 }, { id: 'b', score: 5 }]);
    expect(result.every((r) => r.score === 1.0)).toBe(true);
  });

  it('returns empty array for empty input', () => {
    expect(normalizeScores([])).toEqual([]);
  });
});

describe('clampScores', () => {
  it('clamps scores above 1 to 1', () => {
    const result = clampScores([{ id: 'a', score: 1.5 }]);
    expect(result[0].score).toBe(1.0);
  });

  it('clamps scores below 0 to 0', () => {
    const result = clampScores([{ id: 'a', score: -0.3 }]);
    expect(result[0].score).toBe(0.0);
  });
});
