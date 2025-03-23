/**
 * Creates preset masks for common formats
 */

import { createMask } from './mask';
import type { Mask, MaskOptions } from './types';

/**
 * Creates a date mask (MM/DD/YYYY)
 */
export const createDateMask = (options?: Partial<MaskOptions>): Mask => {
  return createMask({
    mask: '##/##/####',
    ...options,
  });
};

/**
 * Creates a phone mask ((XXX) XXX-XXXX)
 */
export const createPhoneMask = (options?: Partial<MaskOptions>): Mask => {
  return createMask({
    mask: '(###) ###-####',
    ...options,
  });
};

/**
 * Creates a credit card mask (XXXX XXXX XXXX XXXX)
 */
export const createCardMask = (options?: Partial<MaskOptions>): Mask => {
  return createMask({
    mask: '#### #### #### ####',
    ...options,
  });
};

/**
 * Creates a time mask (HH:MM)
 */
export const createTimeMask = (options?: Partial<MaskOptions>): Mask => {
  return createMask({
    mask: '##:##',
    ...options,
  });
};

/**
 * Creates an IP address mask (XXX.XXX.XXX.XXX)
 */
export const createIpMask = (options?: Partial<MaskOptions>): Mask => {
  return createMask({
    mask: '###.###.###.###',
    ...options,
  });
};
