import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PATTERNS,
  parseMaskWithOptionalSections,
  expandRegexPatterns,
} from './patterns';

describe('Default Patterns', () => {
  it('should have predefined patterns', () => {
    expect(DEFAULT_PATTERNS['#']).toBeDefined();
    expect(DEFAULT_PATTERNS['A']).toBeDefined();
    expect(DEFAULT_PATTERNS['*']).toBeDefined();
    expect(DEFAULT_PATTERNS['U']).toBeDefined();
    expect(DEFAULT_PATTERNS['L']).toBeDefined();
  });

  it('should validate numeric pattern', () => {
    const numericPattern = DEFAULT_PATTERNS['#'].pattern;
    expect(numericPattern.test('5')).toBe(true);
    expect(numericPattern.test('a')).toBe(false);
  });

  it('should validate alphabetic pattern', () => {
    const alphabeticPattern = DEFAULT_PATTERNS['A'].pattern;
    expect(alphabeticPattern.test('A')).toBe(true);
    expect(alphabeticPattern.test('z')).toBe(true);
    expect(alphabeticPattern.test('5')).toBe(false);
  });

  it('should transform uppercase and lowercase patterns', () => {
    const uppercaseTransform = DEFAULT_PATTERNS['U'].transform;
    const lowercaseTransform = DEFAULT_PATTERNS['L'].transform;

    expect(uppercaseTransform).toBeDefined();
    expect(lowercaseTransform).toBeDefined();

    if (uppercaseTransform) {
      expect(uppercaseTransform('a')).toBe('A');
    }

    if (lowercaseTransform) {
      expect(lowercaseTransform('A')).toBe('a');
    }
  });
});

describe('Optional Sections Parsing', () => {
  it('should parse mask with optional sections', () => {
    const { parsedMask, optionalSections } =
      parseMaskWithOptionalSections('##[/##]');

    expect(parsedMask).toBe('##/##');
    expect(optionalSections).toHaveLength(1);
    expect(optionalSections[0]).toEqual({
      start: 2,
      end: 4,
      content: '/##',
    });
  });

  it('should handle multiple optional sections', () => {
    const { parsedMask, optionalSections } =
      parseMaskWithOptionalSections('##[/##][/####]');

    expect(parsedMask).toBe('##/##/####');
    expect(optionalSections).toHaveLength(2);
  });

  it('should handle mask without optional sections', () => {
    const { parsedMask, optionalSections } =
      parseMaskWithOptionalSections('##/##/####');

    expect(parsedMask).toBe('##/##/####');
    expect(optionalSections).toHaveLength(0);
  });
});

describe('Regex Pattern Expansion', () => {
  it('should expand regex patterns', () => {
    const { expandedMask, regexPatterns } = expandRegexPatterns('#{[a-z]}');

    expect(Object.keys(regexPatterns)).toHaveLength(1);
    expect(expandedMask).toBe('#R0');
    expect(regexPatterns['#R0']).toBeDefined();
  });

  it('should handle invalid regex', () => {
    const { expandedMask, regexPatterns } = expandRegexPatterns('#{[');

    expect(Object.keys(regexPatterns)).toHaveLength(0);
    expect(expandedMask).toBe('#{[');
  });

  it('should work with multiple regex patterns', () => {
    const { expandedMask, regexPatterns } =
      expandRegexPatterns('#{[a-z]}-#{[0-9]}');

    expect(Object.keys(regexPatterns)).toHaveLength(2);
    expect(expandedMask).toBe('#R0-#R1');
  });

  // Additional tests for regex pattern expansion
  it('should correctly expand single regex pattern', () => {
    const { expandedMask, regexPatterns } = expandRegexPatterns('#{[0-9]}');

    expect(Object.keys(regexPatterns)).toHaveLength(1);
    expect(expandedMask).toBe('#R0');
    expect(regexPatterns['#R0']).toBeDefined();
    expect(regexPatterns['#R0'].test('5')).toBe(true);
    expect(regexPatterns['#R0'].test('a')).toBe(false);
  });

  it('should handle more complex patterns', () => {
    const { expandedMask, regexPatterns } = expandRegexPatterns(
      '#{[a-z]}-#{[0-9]}-#{[A-Z]}',
    );

    expect(Object.keys(regexPatterns)).toHaveLength(3);
    expect(expandedMask).toBe('#R0-#R1-#R2');

    // Test the regex patterns
    expect(regexPatterns['#R0'].test('a')).toBe(true);
    expect(regexPatterns['#R1'].test('5')).toBe(true);
    expect(regexPatterns['#R2'].test('Z')).toBe(true);
  });

  it('should work with mixed standard and regex patterns', () => {
    const { expandedMask, regexPatterns } = expandRegexPatterns('A-#{[0-9]}-#');

    expect(Object.keys(regexPatterns)).toHaveLength(1);
    expect(expandedMask).toBe('A-#R0-#');
  });
});
