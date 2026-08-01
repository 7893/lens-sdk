import { describe, it, expect, vi } from 'vitest';
import { deduplicateResults, wrapSearchResponse, paginateResults } from '../src/result';

describe('deduplicateResults', () => {
  it('removes duplicates keeping highest score', () => {
    const results = [
      { id: 'a', score: 0.9 },
      { id: 'a', score: 0.7 },
      { id: 'b', score: 0.5 },
    ];
    const deduped = deduplicateResults(results);
    expect(deduped).toHaveLength(2);
    expect(deduped.find((r) => r.id === 'a')?.score).toBe(0.9);
  });

  it('returns empty array for empty input', () => {
    expect(deduplicateResults([])).toEqual([]);
  });
});

describe('wrapSearchResponse', () => {
  it('includes total and took', () => {
    const start = Date.now() - 100;
    const response = wrapSearchResponse([{ id: 'a', score: 1.0 }], start);
    expect(response.total).toBe(1);
    expect(response.took).toBeGreaterThanOrEqual(100);
  });
});

describe('paginateResults', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: `item-${i}`, score: 1 }));

  it('returns correct page', () => {
    const page2 = paginateResults(items, 2, 10);
    expect(page2).toHaveLength(10);
    expect(page2[0].id).toBe('item-10');
  });

  it('returns partial last page', () => {
    const page3 = paginateResults(items, 3, 10);
    expect(page3).toHaveLength(5);
  });

  it('returns empty for out-of-range page', () => {
    expect(paginateResults(items, 10, 10)).toEqual([]);
  });
});
