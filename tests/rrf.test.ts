import { describe, it, expect } from 'vitest';
import { rrfRank } from '../src/rrf';

describe('rrfRank', () => {
  it('merges two disjoint lists', () => {
    const fts = [{ id: 'a' }, { id: 'b' }];
    const vec = [{ id: 'c', score: 0.9 }, { id: 'd', score: 0.7 }];
    const result = rrfRank(fts, vec);
    expect(result).toHaveLength(4);
    expect(result.filter((r) => r.source === 'fts')).toHaveLength(2);
    expect(result.filter((r) => r.source === 'vector')).toHaveLength(2);
  });

  it('marks overlapping items as both and boosts their score', () => {
    const fts = [{ id: 'a' }, { id: 'b' }];
    const vec = [{ id: 'b', score: 0.9 }, { id: 'c', score: 0.5 }];
    const result = rrfRank(fts, vec);
    const b = result.find((r) => r.id === 'b');
    expect(b?.source).toBe('both');
    // b appears in both lists so its RRF score should be higher than a (fts only)
    const a = result.find((r) => r.id === 'a');
    expect(b!.score).toBeGreaterThan(a!.score);
  });

  it('returns items sorted by descending score', () => {
    const fts = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const vec = [{ id: 'c', score: 0.95 }];
    const result = rrfRank(fts, vec);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].score).toBeLessThanOrEqual(result[i - 1].score);
    }
  });

  it('handles empty inputs', () => {
    expect(rrfRank([], [])).toEqual([]);
    expect(rrfRank([{ id: 'a' }], [])).toHaveLength(1);
    expect(rrfRank([], [{ id: 'a', score: 0.9 }])).toHaveLength(1);
  });
});
