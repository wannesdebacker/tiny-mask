/**
 * Preset character definitions for masks
 */
export type MaskCharacter = {
  /** Character match pattern */
  pattern: RegExp;
  /** Optional transform function to apply to matched character */
  transform?: (char: string) => string;
  /** Optional validation function for the entire raw value */
  validate?: (rawValue: string) => boolean;
};

/**
 * Character definitions for the mask
 */
export type MaskPattern = {
  [key: string]: MaskCharacter;
};

/**
 * Configuration for optional mask sections
 */
export interface OptionalSectionConfig {
  /** Start index in the mask */
  start: number;
  /** End index in the mask */
  end: number;
  /** The content of the optional section */
  content: string;
}

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

  /** Enable flexible length handling for sections in [] brackets */
  enableOptionalSections?: boolean;

  /** Enable custom regex patterns in {} braces */
  enableRegexPatterns?: boolean;

  /** Accessibility: Custom description for screen readers */
  ariaDescription?: string;

  /** Accessibility: Whether to announce changes to screen readers */
  announceChanges?: boolean;

  /** Custom validation function for the entire input */
  validate?: (rawValue: string) => boolean;
};

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the value is valid */
  isValid: boolean;
  /** Optional error message */
  errorMessage?: string;
}

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

  /** Optional sections that are active */
  activeOptionalSections?: number[];

  /** Validation state */
  validation?: ValidationResult;
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

  /** Validate the current value */
  validate: () => ValidationResult;
}

/**
 * Options for initialization
 */
export interface InitOptions {
  /** Attribute name for mask pattern */
  maskAttr?: string;

  /** Optional ID to identify this group of masks (for update/destroy) */
  id?: string;

  /** Accessibility: Enable screen reader announcements */
  enableA11yAnnouncements?: boolean;

  /** Accessibility: Add default descriptions for mask formats */
  addA11yDescriptions?: boolean;
}

/**
 * Result of initialization
 */
export interface InitResult {
  /** Unique ID for this group of masks */
  id: string;

  /** Number of masks created */
  count: number;

  /** Map of elements to their masks */
  masks: Map<HTMLInputElement, Mask>;

  /** Refresh/reinitialize masks */
  refresh: () => InitResult;

  /** Update masks with new options */
  update: (options?: Partial<InitOptions>) => InitResult;

  /** Destroy all masks in this group */
  destroy: () => void;
}
