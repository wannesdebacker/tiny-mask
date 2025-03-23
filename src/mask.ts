import type { Mask, MaskOptions, MaskState } from './types';
import { DEFAULT_PATTERNS } from './patterns';

/**
 * Creates a new input mask
 */
export const createMask = (options: MaskOptions): Mask => {
  const config = {
    placeholder: '_',
    keepLiterals: true,
    insertLiterals: true,
    patterns: DEFAULT_PATTERNS,
    ...options,
  };

  let inputElement: HTMLInputElement | null = null;
  let state: MaskState = {
    rawValue: '',
    maskedValue: '',
    cursorPosition: 0,
  };

  const handlers: { [key: string]: EventListener } = {};

  /**
   * Applies the mask to the input value
   */
  const applyMask = (input: string): string => {
    let result = '';
    let inputIndex = 0;

    for (let i = 0; i < config.mask.length && inputIndex < input.length; i++) {
      const maskChar = config.mask[i];
      const pattern = config.patterns?.[maskChar];

      if (pattern) {
        let found = false;
        while (inputIndex < input.length && !found) {
          const char = input[inputIndex];
          if (pattern.pattern.test(char)) {
            result += pattern.transform ? pattern.transform(char) : char;
            found = true;
          }
          inputIndex++;
        }

        if (!found) {
          result += config.placeholder;
        }
      } else {
        result += maskChar;

        if (inputIndex < input.length && input[inputIndex] === maskChar) {
          inputIndex++;
        }
      }
    }

    return result;
  };

  /**
   * Extracts raw value from masked input
   */
  const extractRawValue = (maskedValue: string): string => {
    let result = '';

    for (let i = 0; i < maskedValue.length; i++) {
      const char = maskedValue[i];
      const maskChar = i < config.mask.length ? config.mask[i] : null;

      if (
        maskChar &&
        config.patterns?.[maskChar] &&
        char !== config.placeholder
      ) {
        result += char;
      } else if (config.mask.indexOf(char) === -1) {
        // It's not a mask literal and not a placeholder
        result += char;
      }
    }

    return result;
  };

  /**
   * Calculates the next cursor position
   */
  const getNextCursorPosition = (
    _maskedValue: string,
    cursorPosition: number,
  ): number => {
    for (let i = cursorPosition; i < config.mask.length; i++) {
      const maskChar = config.mask[i];
      if (config.patterns?.[maskChar]) {
        return i;
      }
    }

    return cursorPosition;
  };

  /**
   * Handles input changes
   */
  const handleInput = (event: Event): void => {
    if (!inputElement) return;

    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    const selectionStart = input.selectionStart || 0;

    const maskedValue = applyMask(newValue);
    const rawValue = extractRawValue(maskedValue);

    state = {
      rawValue,
      maskedValue,
      cursorPosition: getNextCursorPosition(maskedValue, selectionStart),
    };

    input.value = maskedValue;

    setTimeout(() => {
      if (inputElement) {
        inputElement.setSelectionRange(
          state.cursorPosition,
          state.cursorPosition,
        );
      }
    }, 0);

    if (config.onChange) {
      config.onChange(rawValue, maskedValue);
    }
  };

  /**
   * Handles keydown events for special key handling
   */
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (!inputElement) return;

    if (event.key === 'Backspace' && config.keepLiterals) {
      const selectionStart = inputElement.selectionStart || 0;

      if (selectionStart > 0) {
        const charIndex = selectionStart - 1;
        const maskChar = config.mask[charIndex];

        if (maskChar && !config.patterns?.[maskChar]) {
          event.preventDefault();
          inputElement.setSelectionRange(charIndex, charIndex);
        }
      }
    }
  };

  /**
   * Mounts the mask to an input element
   */
  const mount = (element: HTMLInputElement): void => {
    unmount();

    // Set new input element
    inputElement = element;

    // Add event listeners
    handlers.input = handleInput.bind(null) as EventListener;
    handlers.keydown = handleKeyDown.bind(null) as EventListener;

    inputElement.addEventListener('input', handlers.input);
    inputElement.addEventListener('keydown', handlers.keydown);

    // Initialize with current value
    if (inputElement.value) {
      const maskedValue = applyMask(inputElement.value);
      const rawValue = extractRawValue(maskedValue);

      state = {
        rawValue,
        maskedValue,
        cursorPosition: 0,
      };

      inputElement.value = maskedValue;
    }
  };

  /**
   * Unmounts the mask from input element
   */
  const unmount = (): void => {
    if (inputElement) {
      // Remove event listeners
      Object.entries(handlers).forEach(([event, handler]) => {
        inputElement?.removeEventListener(event, handler);
      });

      inputElement = null;
    }
  };

  /**
   * Gets the current raw value
   */
  const getValue = (): string => {
    return state.rawValue;
  };

  /**
   * Sets a new value
   */
  const setValue = (value: string): void => {
    if (!inputElement) return;

    const maskedValue = applyMask(value);
    const rawValue = extractRawValue(maskedValue);

    state = {
      rawValue,
      maskedValue,
      cursorPosition: maskedValue.length,
    };

    inputElement.value = maskedValue;

    // Call onChange callback if provided
    if (config.onChange) {
      config.onChange(rawValue, maskedValue);
    }
  };

  /**
   * Updates mask options
   */
  const updateOptions = (newOptions: Partial<MaskOptions>): void => {
    Object.assign(config, newOptions);

    // Re-apply mask with new options
    if (inputElement && inputElement.value) {
      setValue(state.rawValue);
    }
  };

  /**
   * Destroys the mask
   */
  const destroy = (): void => {
    unmount();
    state = {
      rawValue: '',
      maskedValue: '',
      cursorPosition: 0,
    };
  };

  // Return public API
  return {
    mount,
    unmount,
    getValue,
    setValue,
    updateOptions,
    destroy,
  };
};
