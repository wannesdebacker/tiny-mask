import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMask } from './mask';
import { createDateMask } from './presets';

describe('Mask Creation', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(input);
  });

  it('should create a basic mask', () => {
    const mask = createMask({
      mask: '##/##/####',
      placeholder: '_',
    });

    mask.mount(input);
    input.value = '12345678';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12/34/5678');
  });

  it('should validate input', () => {
    const mask = createMask({
      mask: '###',
      validate: (value) => value.length === 3,
    });

    mask.mount(input);
    input.value = '12';
    input.dispatchEvent(new Event('input'));

    const validation = mask.validate();
    expect(validation.isValid).toBe(false);

    input.value = '123';
    input.dispatchEvent(new Event('input'));

    const validValidation = mask.validate();
    expect(validValidation.isValid).toBe(true);
  });

  it('should handle keepLiterals option', () => {
    const mask = createMask({
      mask: '##/##',
      keepLiterals: true,
    });

    mask.mount(input);
    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12/34');
  });

  it('should set and get values', () => {
    const mask = createMask({
      mask: '####-####',
    });

    mask.mount(input);
    mask.setValue('12345678');

    expect(input.value).toBe('1234-5678');
    expect(mask.getValue()).toBe('12345678');
  });

  it('should handle optional sections', () => {
    const mask = createMask({
      mask: '##[/##]',
      enableOptionalSections: true,
    });

    mask.mount(input);
    input.value = '12';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12');

    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12/34');
  });

  it('should destroy the mask', () => {
    const mask = createMask({
      mask: '##/##/####',
    });

    mask.mount(input);
    mask.destroy();

    // Verify cleanup (you might want to check specific attributes or behaviors)
    expect(input.value).toBe('');
  });

  describe('Mask Accessibility', () => {
    it('should add aria description', () => {
      const mask = createMask({
        mask: '##/##/####',
        ariaDescription: 'Enter date in format MM/DD/YYYY',
      });

      mask.mount(input);

      const descriptionElement = document.getElementById(
        `${input.id}-description`,
      );
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement?.textContent).toBe(
        'Enter date in format MM/DD/YYYY',
      );
    });

    it('should add screen reader live region', () => {
      const mask = createMask({
        mask: '##/##/####',
        announceChanges: true,
      });

      mask.mount(input);

      const siblingElement = input.nextElementSibling;
      expect(siblingElement?.getAttribute('aria-live')).toBe('polite');
    });
  });

  // Additional custom pattern tests
  describe('Advanced Custom Patterns', () => {
    it('should handle mixed pattern types', () => {
      const mask = createMask({
        mask: 'U##L',
        // No custom patterns, should use defaults
      });

      mask.mount(input);
      input.value = 'a12B';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('A12b');
    });

    it('should handle updating options after mount', () => {
      const mask = createMask({
        mask: 'AAA',
        patterns: {
          A: { pattern: /[A-Z]/ },
        },
      });

      mask.mount(input);
      input.value = 'ABC';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('ABC');

      // Update options to transform to lowercase
      mask.updateOptions({
        patterns: {
          A: { pattern: /[A-Z]/, transform: (char) => char.toLowerCase() },
        },
      });

      input.value = 'ABC';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('abc');
    });
  });

  // Additional date mask tests
  describe('Custom Date Mask Formats', () => {
    it('should correctly format date with default mask', () => {
      const mask = createDateMask();
      mask.mount(input);

      input.value = '12312023';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('12/31/2023');
    });

    it('should correctly format date with YYYY-MM-DD mask', () => {
      const mask = createDateMask({
        mask: 'YYYY-MM-DD',
      });
      mask.mount(input);

      input.value = '20231231';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('2023-12-31');
    });

    it('should correctly format date with DD.MM.YYYY mask', () => {
      const mask = createDateMask({
        mask: 'DD.MM.YYYY',
      });
      mask.mount(input);

      input.value = '31122023';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('31.12.2023');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const mask = createMask({
        mask: '###-###',
      });

      mask.mount(input);
      input.value = '';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('');
    });

    it('should handle input that is too long', () => {
      const mask = createMask({
        mask: '###',
      });

      mask.mount(input);
      input.value = '12345';
      input.dispatchEvent(new Event('input'));

      // Should only use the first 3 digits
      expect(input.value).toBe('123');
    });

    it('should handle input with non-matching characters', () => {
      const mask = createMask({
        mask: '###',
      });

      mask.mount(input);
      input.value = 'abc';
      input.dispatchEvent(new Event('input'));

      // Should be empty because it won't fill in
      expect(input.value).toBe('');
    });

    it('should handle unmounting and remounting', () => {
      const mask = createMask({
        mask: '###-###',
      });

      // Mount
      mask.mount(input);
      input.value = '123456';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('123-456');

      // Unmount
      mask.unmount();

      // Should be able to input without masking
      input.value = '123456';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('123456');

      // Remount
      mask.mount(input);
      input.value = '654321';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('654-321');
    });

    it('should handle mask with only literal characters', () => {
      const mask = createMask({
        mask: '---',
      });

      mask.mount(input);
      input.value = 'abc';
      input.dispatchEvent(new Event('input'));

      // Should output just the mask literals
      expect(input.value).toBe('---');
    });

    it('should handle repeated pattern characters', () => {
      const mask = createMask({
        mask: 'A#A#A#',
      });

      mask.mount(input);
      input.value = 'a1b2c3';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('a1b2c3');
    });

    it('should handle repeated pattern characters with transforms', () => {
      const mask = createMask({
        mask: 'U#U#L#',
      });

      mask.mount(input);
      input.value = 'a1b2c3';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('A1B2c3');
    });

    it('should support validation function', () => {
      const validateFn = vi.fn((value: string) => value.length >= 5);

      const mask = createMask({
        mask: '######',
        validate: validateFn,
      });

      mask.mount(input);

      // Invalid - too short
      input.value = '1234';
      input.dispatchEvent(new Event('input'));
      expect(mask.validate().isValid).toBe(false);

      // Valid - long enough
      input.value = '12345';
      input.dispatchEvent(new Event('input'));
      expect(mask.validate().isValid).toBe(true);

      // Check that our validator was called
      expect(validateFn).toHaveBeenCalled();
    });
  });
});
