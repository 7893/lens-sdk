import { describe, it, expect } from 'vitest';
import { buildQueryPrompt } from '../src/prompt';

describe('buildQueryPrompt', () => {
  it('expands short queries', () => {
    const prompt = buildQueryPrompt('东京夜景');
    expect(prompt).toContain('expand into a descriptive scene');
    expect(prompt).toContain('东京夜景');
  });

  it('only translates long queries', () => {
    const prompt = buildQueryPrompt('a long descriptive query about mountain landscapes at dawn');
    expect(prompt).not.toContain('expand');
    expect(prompt).toContain('Translate to English');
  });

  it('respects custom shortQueryThreshold', () => {
    const prompt = buildQueryPrompt('one two three four five', { shortQueryThreshold: 6 });
    expect(prompt).toContain('expand');
  });

  it('respects custom maxWords', () => {
    const prompt = buildQueryPrompt('cats', { maxWords: 50 });
    expect(prompt).toContain('max 50 words');
  });
});
