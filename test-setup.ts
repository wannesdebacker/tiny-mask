import { vi, beforeEach } from 'vitest';

// Minimal setup to ensure basic browser APIs are available
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb) =>
    setTimeout(cb, 0) as unknown as number;
}

beforeEach(() => {
  vi.clearAllMocks();
});
