import { describe, it, expect } from 'vitest';
import { dynamicCutoff } from '../src/cutoff';

describe('dynamicCutoff', () => {
  it('returns 0 for empty input', () => {
    expect(dynamicCutoff([])).toBe(0);
  });

  it('keeps all FTS results (score >= 0.99)', () => {
    const results = [
      { id: 'a', score: 1.0 },
      { id: 'b', score: 1.0 },
      { id: 'c', score: 0.3 }, // below absoluteFloor
    ];
    expect(dynamicCutoff(results)).toBe(2);
  });

  it('cuts off at absoluteFloor', () => {
    const results = [
      { id: 'a', score: 0.9 },
      { id: 'b', score: 0.8 },
      { id: 'c', score: 0.35 }, // below 0.4
    ];
    expect(dynamicCutoff(results)).toBe(2);
  });

  it('respects maxResults option', () => {
    const results = Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i}`,
      score: 0.9 - i * 0.001,
    }));
    expect(dynamicCutoff(results, { maxResults: 10 })).toBeLessThanOrEqual(10);
  });

  it('detects score cliff', () => {
    const results = [
      { id: 'a', score: 0.9 },
      { id: 'b', score: 0.85 },
      { id: 'c', score: 0.42 }, // big drop + below cliffFloor
    ];
    expect(dynamicCutoff(results)).toBe(2);
  });
});
