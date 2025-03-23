import { html } from 'lit';
import { createDateMask, createPhoneMask } from '../index';
export default {
    title: 'Input Masks',
    parameters: {
        layout: 'centered',
    },
};
const applyMask = (maskCreator, inputId, canvasElement) => {
    const input = canvasElement.querySelector(`#${inputId}`);
    if (!input)
        return;
    const mask = maskCreator();
    mask.mount(input);
};
export const DateMaskExample = {
    render: () => {
        return html `
      <div style="padding: 1rem;">
        <label for="date-input">Date (MM/DD/YYYY):</label>
        <input id="date-input" placeholder="MM/DD/YYYY" />
      </div>
    `;
    },
    play: async ({ canvasElement }) => {
        applyMask(createDateMask, 'date-input', canvasElement);
    },
};
export const PhoneMaskExample = {
    render: () => {
        return html `
      <div style="padding: 1rem;">
        <label for="phone-input">Phone ((XXX) XXX-XXXX):</label>
        <input id="phone-input" placeholder="(XXX) XXX-XXXX" />
      </div>
    `;
    },
    play: async ({ canvasElement }) => {
        applyMask(createPhoneMask, 'phone-input', canvasElement);
    },
};
//# sourceMappingURL=mask.stories.js.map