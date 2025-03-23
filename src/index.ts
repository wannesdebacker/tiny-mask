export type {
  MaskCharacter,
  MaskPattern,
  MaskOptions,
  MaskState,
  Mask,
  InitOptions,
  InitResult,
} from './types';

export { createMask } from './mask';
export { DEFAULT_PATTERNS } from './patterns';
export { init } from './init';

export {
  createDateMask,
  createPhoneMask,
  createCardMask,
  createTimeMask,
  createIpMask,
} from './utils';

console.log('Processing index.ts');
