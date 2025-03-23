import type { MaskPattern } from './types';

/**
 * Default pattern definitions for common use cases
 */
export const DEFAULT_PATTERNS: MaskPattern = {
  // Numeric only (0-9)
  '#': {
    pattern: /[0-9]/,
  },
  // Alphabetic only (A-Z, a-z)
  A: {
    pattern: /[a-zA-Z]/,
  },
  // Alphanumeric (A-Z, a-z, 0-9)
  '*': {
    pattern: /[a-zA-Z0-9]/,
  },
  // Uppercase alphabetic (A-Z)
  U: {
    pattern: /[a-zA-Z]/,
    transform: (char: string) => char.toUpperCase(),
  },
  // Lowercase alphabetic (a-z)
  L: {
    pattern: /[a-zA-Z]/,
    transform: (char: string) => char.toLowerCase(),
  },
};
