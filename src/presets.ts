/**
 * Optional preset masks that can be individually imported
 * Import only what you need to keep bundle size small
 */

import { createMask } from './mask';
import type { Mask, MaskPattern, MaskOptions } from './types';

/**
 * Creates a date mask with smart format detection and validation
 */
export const createDateMask = (options?: Partial<MaskOptions>): Mask => {
  // Default date format
  const defaultMask = '##/##/####';

  // Use custom mask format if provided
  const maskFormat = options?.mask || defaultMask;

  const customPatterns: MaskPattern = {
    '#': {
      pattern: /[0-9]/,
      validate: (rawValue: string) => {
        // Basic date validation
        const cleanValue = rawValue.replace(/\D/g, '');
        if (cleanValue.length !== 8) return false;

        const month = parseInt(cleanValue.slice(0, 2), 10);
        const day = parseInt(cleanValue.slice(2, 4), 10);
        const year = parseInt(cleanValue.slice(4), 10);

        return (
          month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1000
        );
      },
    },
  };

  // If using a non-standard mask format with letters, add those patterns too
  if (maskFormat.match(/[YMD]/i)) {
    Object.assign(customPatterns, {
      Y: { pattern: /[0-9]/ },
      M: { pattern: /[0-9]/ },
      D: { pattern: /[0-9]/ },
    });
  }

  // Create final options object with proper typing
  const maskOptions: MaskOptions = {
    mask: maskFormat,
    placeholder: '_',
    keepLiterals: true,
    patterns: customPatterns,
    ...(options || {}),
  };

  return createMask(maskOptions);
};

/**
 * Creates a phone mask ((XXX) XXX-XXXX)
 */
export const createPhoneMask = (options?: Partial<MaskOptions>): Mask => {
  const maskOptions: MaskOptions = {
    mask: '(###) ###-####',
    ...(options || {}),
  };
  return createMask(maskOptions);
};

/**
 * Creates a credit card mask (XXXX XXXX XXXX XXXX)
 */
export const createCardMask = (options?: Partial<MaskOptions>): Mask => {
  const maskOptions: MaskOptions = {
    mask: '#### #### #### ####',
    ...(options || {}),
  };
  return createMask(maskOptions);
};

/**
 * Creates a time mask (HH:MM)
 */
export const createTimeMask = (options?: Partial<MaskOptions>): Mask => {
  const maskOptions: MaskOptions = {
    mask: '##:##',
    ...(options || {}),
  };
  return createMask(maskOptions);
};

/**
 * Creates an IP address mask (XXX.XXX.XXX.XXX)
 */
export const createIpMask = (options?: Partial<MaskOptions>): Mask => {
  const maskOptions: MaskOptions = {
    mask: '###.###.###.###',
    ...(options || {}),
  };
  return createMask(maskOptions);
};
