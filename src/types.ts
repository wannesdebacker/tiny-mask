/**
 * Preset character definitions for masks
 */
export type MaskCharacter = {
  /** Character match pattern */
  pattern: RegExp;
  /** Optional transform function to apply to matched character */
  transform?: (char: string) => string;
};

/**
 * Character definitions for the mask
 */
export type MaskPattern = {
  [key: string]: MaskCharacter;
};

/**
 * Options to configure the mask behavior
 */
export type MaskOptions = {
  /** The mask pattern to apply (e.g., "####-##-##") */
  mask: string;

  /** Custom character definitions */
  patterns?: MaskPattern;

  /** Character to use for unfilled positions */
  placeholder?: string;

  /** Whether to keep literal characters when user deletes */
  keepLiterals?: boolean;

  /** Whether to insert literal characters automatically */
  insertLiterals?: boolean;

  /** Callback for when the input value changes */
  onChange?: (value: string, maskedValue: string) => void;
};

/**
 * Internal state for mask processing
 */
export interface MaskState {
  /** The raw input value without mask */
  rawValue: string;

  /** The formatted value with mask */
  maskedValue: string;

  /** The current cursor position */
  cursorPosition: number;
}

/**
 * Public API of the created mask
 */
export interface Mask {
  /** Apply the mask to a given input element */
  mount: (element: HTMLInputElement) => void;

  /** Remove the mask from the input element */
  unmount: () => void;

  /** Get the current unmasked value */
  getValue: () => string;

  /** Set a new value to the input */
  setValue: (value: string) => void;

  /** Update mask options */
  updateOptions: (options: Partial<MaskOptions>) => void;

  /** Destroy and clean up the mask */
  destroy: () => void;
}

/**
 * Options for initialization
 */
export interface InitOptions {
  /** Attribute name for mask pattern */
  maskAttr?: string;
}

/**
 * Result of initialization
 */
export interface InitResult {
  count: number;
  masks: Map<HTMLInputElement, Mask>;
  refresh: () => InitResult;
  destroy: () => void;
}
