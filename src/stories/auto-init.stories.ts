import { html } from 'lit';
import { init } from '../index';

export default {
  title: 'Input Masks/Auto Init',
  parameters: {
    layout: 'centered',
  },
};

export const DeclarativeInit = {
  render: () => {
    return html`
      <div
        style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem; max-width: 300px;"
      >
        <div>
          <label for="auto-date">Date:</label>
          <input
            id="auto-date"
            data-mask="##/##/####"
            placeholder="MM/DD/YYYY"
          />
        </div>

        <div>
          <label for="auto-phone">Phone:</label>
          <input
            id="auto-phone"
            data-mask="(###) ###-####"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>

        <div>
          <label for="auto-card">Credit Card:</label>
          <input
            id="auto-card"
            data-mask="#### #### #### ####"
            placeholder="XXXX XXXX XXXX XXXX"
          />
        </div>

        <div>
          <label for="auto-time">Time:</label>
          <input id="auto-time" data-mask="##:##" placeholder="HH:MM" />
        </div>

        <div>
          <label for="auto-ip">IP Address:</label>
          <input
            id="auto-ip"
            data-mask="###.###.###.###"
            placeholder="XXX.XXX.XXX.XXX"
          />
        </div>

        <div>
          <label for="auto-custom">Custom (AAA-###-AAA):</label>
          <input
            id="auto-custom"
            data-mask="AAA-###-AAA"
            placeholder="ABC-123-XYZ"
          />
        </div>
      </div>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Initialize all inputs with data-mask attribute
    init(canvasElement);
  },
};

// Demonstrate custom placeholder
export const CustomPlaceholder = {
  render: () => {
    return html`
      <div style="padding: 1rem;">
        <label for="custom-placeholder">Date with * placeholder:</label>
        <input
          id="custom-placeholder"
          data-mask="##/##/####"
          data-mask-placeholder="*"
          placeholder="MM/DD/YYYY"
        />
      </div>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    init(canvasElement);
  },
};

// Demonstrate behavior options
export const BehaviorOptions = {
  render: () => {
    return html`
      <div
        style="padding: 1rem; display: flex; flex-direction: column; gap: 1rem; max-width: 300px;"
      >
        <div>
          <label for="keep-literals">
            Standard mask (keep literals when deleting):
          </label>
          <input
            id="keep-literals"
            data-mask="##/##/####"
            placeholder="MM/DD/YYYY"
          />
        </div>

        <div>
          <label for="no-keep-literals">
            No keep literals (delete through separators):
          </label>
          <input
            id="no-keep-literals"
            data-mask="##/##/####"
            data-mask-keep-literals="false"
            placeholder="MM/DD/YYYY"
          />
        </div>
      </div>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    init(canvasElement);
  },
};
