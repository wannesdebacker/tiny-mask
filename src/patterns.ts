import type { MaskPattern, OptionalSectionConfig } from './types';

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

/**
 * Helper function to parse mask with optional sections
 * Handles sections marked with [ ] in the mask string
 */
export const parseMaskWithOptionalSections = (
  maskStr: string,
): { parsedMask: string; optionalSections: OptionalSectionConfig[] } => {
  const optionalSections: OptionalSectionConfig[] = [];
  let parsedMask = '';
  let index = 0;

  // Parse the mask and identify optional sections
  for (let i = 0; i < maskStr.length; i++) {
    if (maskStr[i] === '[') {
      // Found start of optional section
      const sectionStart = index;
      let sectionContent = '';
      i++; // Move past the '['

      // Extract content of the optional section
      while (i < maskStr.length && maskStr[i] !== ']') {
        sectionContent += maskStr[i];
        i++;
      }

      // Add the optional section to our parsed mask
      parsedMask += sectionContent;

      // Record this optional section
      optionalSections.push({
        start: sectionStart,
        end: sectionStart + sectionContent.length - 1,
        content: sectionContent,
      });

      // Update index to point after the optional section
      index += sectionContent.length;
    } else {
      // Regular character
      parsedMask += maskStr[i];
      index++;
    }
  }

  return { parsedMask, optionalSections };
};

/**
 * Helper function to handle dynamic regex patterns in masks
 * Expands patterns like #{regex} to a corresponding mask pattern
 */
export const expandRegexPatterns = (
  maskStr: string,
): { expandedMask: string; regexPatterns: Record<string, RegExp> } => {
  const regexPatterns: Record<string, RegExp> = {};
  let expandedMask = '';
  let regexCounter = 0;

  // Use regular expression to find patterns like #{...}
  const regexPattern = /#\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = regexPattern.exec(maskStr)) !== null) {
    // Add the text before the match
    expandedMask += maskStr.substring(lastIndex, match.index);

    // Get the regex pattern inside {}
    const regexStr = match[1];

    try {
      // Create unique placeholder for this regex pattern
      const placeholder = `#R${regexCounter}`;
      regexPatterns[placeholder] = new RegExp(regexStr);
      expandedMask += placeholder;
      regexCounter++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // If regex is invalid, preserve the original text
      expandedMask += match[0];
    }

    lastIndex = regexPattern.lastIndex;
  }

  // Add any remaining text
  if (lastIndex < maskStr.length) {
    expandedMask += maskStr.substring(lastIndex);
  }

  // If no patterns were found or processing failed, return the original mask
  if (expandedMask === '') {
    return { expandedMask: maskStr, regexPatterns };
  }

  return { expandedMask, regexPatterns };
};
