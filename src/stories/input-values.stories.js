import { html } from 'lit';
import { init } from '../index';
import { createDateMask, createPhoneMask } from '../utils';
export default {
    title: 'Input Masks/Raw Values',
    parameters: {
        layout: 'centered',
    },
};
export const RawValuesDemo = {
    render: () => {
        return html `
      <div
        style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem; max-width: 400px;"
      >
        <h3>Input Masking with Value Display</h3>
        <p>Type in the masked inputs and see the actual raw values below</p>

        <div>
          <label for="date-input">Date (MM/DD/YYYY):</label>
          <input id="date-input" placeholder="MM/DD/YYYY" />
          <div>Raw value: <span id="date-raw"></span></div>
        </div>

        <div>
          <label for="phone-input">Phone ((XXX) XXX-XXXX):</label>
          <input id="phone-input" placeholder="(XXX) XXX-XXXX" />
          <div>Raw value: <span id="phone-raw"></span></div>
        </div>

        <div>
          <label for="auto-ip">IP Address (auto-init):</label>
          <input
            id="auto-ip"
            data-mask="###.###.###.###"
            placeholder="XXX.XXX.XXX.XXX"
          />
          <div>Raw value: <span id="ip-raw"></span></div>
        </div>

        <form id="test-form">
          <div>
            <label for="form-input">Form Input with Mask:</label>
            <input id="form-input" name="phone" data-mask="(###) ###-####" />
            <button type="submit">Submit</button>
          </div>
        </form>
        <div>Form submission value: <span id="form-result"></span></div>
      </div>
    `;
    },
    play: async ({ canvasElement }) => {
        const dateInput = canvasElement.querySelector('#date-input');
        const phoneInput = canvasElement.querySelector('#phone-input');
        const dateRaw = canvasElement.querySelector('#date-raw');
        const phoneRaw = canvasElement.querySelector('#phone-raw');
        const ipRaw = canvasElement.querySelector('#ip-raw');
        const formResult = canvasElement.querySelector('#form-result');
        const dateMask = createDateMask({
            onChange: (rawValue) => {
                dateRaw.textContent = rawValue;
            },
        });
        const phoneMask = createPhoneMask({
            onChange: (rawValue) => {
                phoneRaw.textContent = rawValue;
            },
        });
        dateMask.mount(dateInput);
        phoneMask.mount(phoneInput);
        const { masks } = init(canvasElement);
        const ipInput = canvasElement.querySelector('#auto-ip');
        ipInput.addEventListener('input', () => {
            const ipMask = masks.get(ipInput);
            if (ipMask) {
                ipRaw.textContent = ipMask.getValue();
            }
        });
        // Handle form submission
        const form = canvasElement.querySelector('#test-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            formResult.textContent = formData.get('phone');
        });
    },
};
//# sourceMappingURL=input-values.stories.js.map