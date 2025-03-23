import { createMask } from './mask';
import type { Mask, MaskOptions } from './types';
import { InitOptions, InitResult } from './types';

const globalMaskRegistry: Map<string, Map<HTMLInputElement, Mask>> = new Map();

/**
 * Generate a unique ID for each init call to track mask groups
 */
const generateInitId = (): string => {
  return `init_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Initialize masks based on HTML attributes
 */
export const init = (
  container: Document | Element = document,
  options: InitOptions = {},
): InitResult => {
  const { maskAttr = 'data-mask', id = generateInitId() } = options;

  let masks: Map<HTMLInputElement, Mask>;
  if (globalMaskRegistry.has(id)) {
    masks = globalMaskRegistry.get(id)!;
    return update(id, container, options);
  } else {
    masks = new Map<HTMLInputElement, Mask>();
    globalMaskRegistry.set(id, masks);
  }

  const elements = container.querySelectorAll<HTMLInputElement>(
    `[${maskAttr}]`,
  );

  elements.forEach((element) => {
    if (masks.has(element)) {
      return;
    }

    const maskPattern = element.getAttribute(maskAttr);
    if (!maskPattern) return;

    const placeholder = element.getAttribute('data-mask-placeholder') || '_';
    const keepLiterals =
      element.getAttribute('data-mask-keep-literals') !== 'false';
    const insertLiterals =
      element.getAttribute('data-mask-insert-literals') !== 'false';
    const enableOptionalSections =
      element.getAttribute('data-mask-optional-sections') === 'true';
    const enableRegexPatterns =
      element.getAttribute('data-mask-regex-patterns') === 'true';

    const maskOptions: MaskOptions = {
      mask: maskPattern,
      placeholder,
      keepLiterals,
      insertLiterals,
      enableOptionalSections,
      enableRegexPatterns,
    };

    const mask = createMask(maskOptions);
    mask.mount(element);
    masks.set(element, mask);
  });

  const result: InitResult = {
    id,
    count: masks.size,
    masks,
    refresh: () => init(container, { ...options, id }),
    update: (newOptions: Partial<InitOptions> = {}) =>
      update(id, container, { ...options, ...newOptions }),
    destroy: () => {
      masks.forEach((mask) => mask.destroy());
      masks.clear();
      globalMaskRegistry.delete(id);
      result.count = 0;
      result.masks.clear();
      return result;
    },
  };

  return result;
};

/**
 * Update existing masks with new options
 */
export const update = (
  id: string,
  container: Document | Element = document,
  options: InitOptions = {},
): InitResult => {
  const { maskAttr = 'data-mask' } = options;

  if (!globalMaskRegistry.has(id)) {
    return init(container, options);
  }

  const masks = globalMaskRegistry.get(id)!;

  // Handle removed elements
  masks.forEach((mask, element) => {
    if (!element.isConnected || !container.contains(element)) {
      mask.destroy();
      masks.delete(element);
    }
  });

  const elements = container.querySelectorAll<HTMLInputElement>(
    `[${maskAttr}]`,
  );

  elements.forEach((element) => {
    const maskPattern = element.getAttribute(maskAttr);
    if (!maskPattern) return;

    const placeholder = element.getAttribute('data-mask-placeholder') || '_';
    const keepLiterals =
      element.getAttribute('data-mask-keep-literals') !== 'false';
    const insertLiterals =
      element.getAttribute('data-mask-insert-literals') !== 'false';
    const enableOptionalSections =
      element.getAttribute('data-mask-optional-sections') === 'true';
    const enableRegexPatterns =
      element.getAttribute('data-mask-regex-patterns') === 'true';

    const maskOptions: MaskOptions = {
      mask: maskPattern,
      placeholder,
      keepLiterals,
      insertLiterals,
      enableOptionalSections,
      enableRegexPatterns,
    };

    if (masks.has(element)) {
      const existingMask = masks.get(element)!;
      existingMask.updateOptions(maskOptions);
    } else {
      const mask = createMask(maskOptions);
      mask.mount(element);
      masks.set(element, mask);
    }
  });

  const result: InitResult = {
    id,
    count: masks.size,
    masks,
    refresh: () => init(container, { ...options, id }),
    update: (newOptions: Partial<InitOptions> = {}) =>
      update(id, container, { ...options, ...newOptions }),
    destroy: () => destroy(id),
  };

  return result;
};

/**
 * Destroy all masks for a specific init ID
 */
export const destroy = (id: string): InitResult => {
  if (!globalMaskRegistry.has(id)) {
    return {
      id,
      count: 0,
      masks: new Map(),
      refresh: () => init(document, { id }),
      update: () => init(document, { id }),
      destroy: () => {},
    };
  }

  const masks = globalMaskRegistry.get(id)!;

  masks.forEach((mask) => {
    mask.destroy();
  });

  masks.clear();
  globalMaskRegistry.delete(id);

  return {
    id,
    count: 0,
    masks: new Map(),
    refresh: () => init(document, { id }),
    update: () => init(document, { id }),
    destroy: () => {},
  };
};

/**
 * Destroy all masks created by any init call
 * Useful for cleaning up before page unload or in SPA navigation
 */
export const destroyAll = (): void => {
  globalMaskRegistry.forEach((_masks, id) => {
    destroy(id);
  });
};
