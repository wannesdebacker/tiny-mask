export type {
  MaskCharacter,
  MaskPattern,
  MaskOptions,
  MaskState,
  Mask,
  InitOptions,
  InitResult,
  ValidationResult,
  OptionalSectionConfig,
} from './types';

export { createMask } from './mask';
export {
  DEFAULT_PATTERNS,
  parseMaskWithOptionalSections,
  expandRegexPatterns,
} from './patterns';
export { init, update, destroy, destroyAll } from './init';

export * from './presets';
