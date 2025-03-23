import { createMask } from './mask';
import type { Mask, MaskOptions } from './types';
import { InitOptions, InitResult } from './types';

/**
 * Initialize masks based on HTML attributes
 */
export const init = (
  container: Document | Element = document,
  options: InitOptions = {},
): InitResult => {
  const { maskAttr = 'data-mask' } = options;

  const elements = container.querySelectorAll<HTMLInputElement>(
    `[${maskAttr}]`,
  );
  const masks = new Map<HTMLInputElement, Mask>();

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

    const maskOptions: MaskOptions = {
      mask: maskPattern,
      placeholder,
      keepLiterals,
      insertLiterals,
    };

    const mask = createMask(maskOptions);
    mask.mount(element);
    masks.set(element, mask);
  });

  const result: InitResult = {
    count: masks.size,
    masks,
    refresh: () => init(container, options),
    destroy: () => {
      masks.forEach((mask) => mask.destroy());
      masks.clear();
    },
  };

  return result;
};
