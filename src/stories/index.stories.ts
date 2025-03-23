import { html, TemplateResult } from 'lit';
import { createMask } from '../index';
import { createDateMask, createPhoneMask, createCardMask } from '../presets';

interface MaskArgs {
  placeholder: string;
  keepLiterals: boolean;
}

export default {
  title: 'Tiny Mask/Basic Masks',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Core mask functionality for common input types.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Character to use for unfilled positions',
      defaultValue: '_',
    },
    keepLiterals: {
      control: 'boolean',
      description: 'Whether to keep literal characters when deleting',
      defaultValue: true,
    },
  },
};

export const DateMask = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="date-input">Date (DD/MM/YYYY):</label>
          <input id="date-input" class="form-input" placeholder="DD/MM/YYYY" />
        </div>
        <div>
          <span>Raw Value: </span>
          <span id="date-raw-value"></span>
        </div>
      </form>
    `;
  },
  play: async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement;
    args: MaskArgs;
  }) => {
    const input = canvasElement.querySelector(
      '#date-input',
    ) as HTMLInputElement;
    const rawValue = canvasElement.querySelector(
      '#date-raw-value',
    ) as HTMLElement;

    const mask = createDateMask({
      placeholder: args.placeholder,
      keepLiterals: args.keepLiterals,
      onChange: (value: string) => {
        rawValue.textContent = value;
      },
    });

    mask.mount(input);
  },
};

export const PhoneMask = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="phone-input">Phone ((###) ###-####):</label>
          <input
            id="phone-input"
            class="form-input"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>
        <div>
          <span>Raw Value: </span>
          <span id="phone-raw-value"></span>
        </div>
      </form>
    `;
  },
  play: async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement;
    args: MaskArgs;
  }) => {
    const input = canvasElement.querySelector(
      '#phone-input',
    ) as HTMLInputElement;
    const rawValue = canvasElement.querySelector(
      '#phone-raw-value',
    ) as HTMLElement;

    const mask = createPhoneMask({
      placeholder: args.placeholder,
      keepLiterals: args.keepLiterals,
      onChange: (value: string) => {
        rawValue.textContent = value;
      },
    });

    mask.mount(input);
  },
};

export const CreditCardMask = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="card-input">Credit Card (#### #### #### ####):</label>
          <input
            id="card-input"
            class="form-input"
            placeholder="XXXX XXXX XXXX XXXX"
          />
        </div>
        <div>
          <span>Raw Value: </span>
          <span id="card-raw-value"></span>
        </div>
      </form>
    `;
  },
  play: async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement;
    args: MaskArgs;
  }) => {
    const input = canvasElement.querySelector(
      '#card-input',
    ) as HTMLInputElement;
    const rawValue = canvasElement.querySelector(
      '#card-raw-value',
    ) as HTMLElement;

    const mask = createCardMask({
      placeholder: args.placeholder,
      keepLiterals: args.keepLiterals,
      onChange: (value: string) => {
        rawValue.textContent = value;
      },
    });

    mask.mount(input);
  },
};

export const CustomMask = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="custom-input">Custom Mask (AAA-###-AAA):</label>
          <input
            id="custom-input"
            class="form-input"
            placeholder="ABC-123-XYZ"
          />
        </div>
        <div>
          <span>Raw Value: </span>
          <span id="custom-raw-value"></span>
        </div>
        <div>
          <span>Valid: </span>
          <span id="custom-valid"></span>
        </div>
      </form>
    `;
  },
  play: async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement;
    args: MaskArgs;
  }) => {
    const input = canvasElement.querySelector(
      '#custom-input',
    ) as HTMLInputElement;
    const rawValue = canvasElement.querySelector(
      '#custom-raw-value',
    ) as HTMLElement;
    const validElement = canvasElement.querySelector(
      '#custom-valid',
    ) as HTMLElement;

    // Custom validation that requires all letters to be filled and at least 1 number
    const validateCustomPattern = (value: string): boolean => {
      // Check if we have letters in all letter positions
      const letterCount = (value.match(/[A-Za-z]/g) || []).length;
      // Check if we have at least one digit
      const digitCount = (value.match(/\d/g) || []).length;

      return letterCount >= 6 && digitCount >= 1;
    };

    const mask = createMask({
      mask: 'AAA-###-AAA',
      placeholder: args.placeholder,
      keepLiterals: args.keepLiterals,
      validate: validateCustomPattern,
      onChange: (value: string) => {
        // Only show the raw value, never undefined
        rawValue.textContent = value || '';

        // Validate and update status
        const validation = mask.validate();
        validElement.textContent = validation.isValid ? 'Yes' : 'No';
      },
    });

    mask.mount(input);

    // Initialize validation display
    validElement.textContent = 'No';
  },
};

export const PlaceholderVariations = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="underscore">Default Placeholder (_):</label>
          <input id="underscore" class="form-input" placeholder="__/__/____" />
        </div>
        <div class="pure-control-group">
          <label for="asterisk">Asterisk Placeholder (*):</label>
          <input id="asterisk" class="form-input" placeholder="**/**/****" />
        </div>
        <div class="pure-control-group">
          <label for="zero">Zero Placeholder (0):</label>
          <input id="zero" class="form-input" placeholder="00/00/0000" />
        </div>
      </form>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const underscore = canvasElement.querySelector(
      '#underscore',
    ) as HTMLInputElement;
    const asterisk = canvasElement.querySelector(
      '#asterisk',
    ) as HTMLInputElement;
    const zero = canvasElement.querySelector('#zero') as HTMLInputElement;

    createDateMask().mount(underscore);
    createDateMask({ placeholder: '*' }).mount(asterisk);
    createDateMask({ placeholder: '0' }).mount(zero);
  },
};
