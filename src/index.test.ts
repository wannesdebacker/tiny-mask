import { describe, it, expect } from 'vitest';
import {
  createMask,
  DEFAULT_PATTERNS,
  init,
  createDateMask,
  createPhoneMask,
} from './index';

describe('Tiny Mask Index Exports', () => {
  it('should export key functions and types', () => {
    expect(createMask).toBeDefined();
    expect(DEFAULT_PATTERNS).toBeDefined();
    expect(init).toBeDefined();
    expect(createDateMask).toBeDefined();
    expect(createPhoneMask).toBeDefined();
  });

  it('should create masks with presets', () => {
    const dateMask = createDateMask();
    const phoneMask = createPhoneMask();

    expect(dateMask).toBeDefined();
    expect(dateMask.mount).toBeDefined();
    expect(phoneMask).toBeDefined();
    expect(phoneMask.mount).toBeDefined();
  });
});
