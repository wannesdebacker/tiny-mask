import { html } from 'lit';
import { createDateMask, createPhoneMask, Mask } from '../index';

export default {
  title: 'Input Masks',
  parameters: {
    layout: 'centered',
  },
};

const applyMask = (
  maskCreator: () => Mask,
  inputId: string,
  canvasElement: HTMLElement,
): void => {
  const input = canvasElement.querySelector(`#${inputId}`) as HTMLInputElement;
  if (!input) return;

  const mask = maskCreator();
  mask.mount(input);
};

export const DateMaskExample = {
  render: () => {
    return html`
      <div style="padding: 1rem;">
        <label for="date-input">Date (MM/DD/YYYY):</label>
        <input id="date-input" placeholder="MM/DD/YYYY" />
      </div>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    applyMask(createDateMask, 'date-input', canvasElement);
  },
};

export const PhoneMaskExample = {
  render: () => {
    return html`
      <div style="padding: 1rem;">
        <label for="phone-input">Phone ((XXX) XXX-XXXX):</label>
        <input id="phone-input" placeholder="(XXX) XXX-XXXX" />
      </div>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    applyMask(createPhoneMask, 'phone-input', canvasElement);
  },
};
