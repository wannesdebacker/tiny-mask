# Tiny Mask

A lightweight, customizable input mask library for form fields. Tiny Mask helps format user input in real-time for common data patterns like dates, phone numbers, credit cards, and more.

## Features

- 🪶 **Lightweight**: Small footprint with minimal dependencies
- 🧩 **Customizable**: Create your own mask patterns or use built-in presets
- 🔍 **Type-safe**: Written in TypeScript with full type definitions
- 🚀 **Framework-agnostic**: Works with any JavaScript framework or vanilla JS
- 📱 **Mobile-friendly**: Handles input events properly on mobile devices
- 🧹 **Clean values**: Separates display format from actual form values
- ♿ **Accessible**: Built-in screen reader support and ARIA attributes

## Installation

```bash
pnpm add tiny-mask
# or
npm install tiny-mask
```

## Usage

### Quick Start

You can use Tiny Mask in two ways:

#### 1. Declarative (HTML attributes)

```html
<input data-mask="##/##/####" placeholder="MM/DD/YYYY" />
<input data-mask="(###) ###-####" placeholder="(XXX) XXX-XXXX" />

<script type="module">
  import { init } from 'tiny-mask';

  // Initialize all inputs with data-mask attribute
  init();
</script>
```

#### 2. Programmatic (JavaScript)

```javascript
import { createDateMask, createPhoneMask } from 'tiny-mask';

// Create and apply a date mask
const dateInput = document.getElementById('date-input');
const dateMask = createDateMask();
dateMask.mount(dateInput);

// Create and apply a phone mask
const phoneInput = document.getElementById('phone-input');
const phoneMask = createPhoneMask();
phoneMask.mount(phoneInput);
```

### Built-in Mask Presets

Tiny Mask comes with several built-in mask presets:

```javascript
import {
  createDateMask, // MM/DD/YYYY
  createPhoneMask, // (XXX) XXX-XXXX
  createCardMask, // XXXX XXXX XXXX XXXX
  createTimeMask, // HH:MM
  createIpMask, // XXX.XXX.XXX.XXX
} from 'tiny-mask';
```

### Custom Masks

You can create custom masks for any pattern:

```javascript
import { createMask } from 'tiny-mask';

// Create a custom mask
const zipCodeMask = createMask({
  mask: '#####-####',
  placeholder: '_',
});

// Apply the mask
zipCodeMask.mount(document.getElementById('zip-code'));
```

### Pattern Characters

- `#`: Numeric only (0-9)
- `A`: Alphabetic only (A-Z, a-z)
- `*`: Alphanumeric (A-Z, a-z, 0-9)
- `U`: Uppercase alphabetic (A-Z)
- `L`: Lowercase alphabetic (a-z)

### Advanced Options

```javascript
import { createMask } from 'tiny-mask';

const mask = createMask({
  mask: '##/##/####',
  placeholder: '_',
  keepLiterals: true,
  insertLiterals: true,
  onChange: (rawValue, maskedValue) => {
    console.log('Raw value:', rawValue);
    console.log('Masked value:', maskedValue);
  },
  // Optional sections
  enableOptionalSections: true,
  // Custom regex patterns
  enableRegexPatterns: true,
});
```

### Accessibility Features

Tiny Mask includes robust accessibility support:

```javascript
const mask = createMask({
  mask: '(###) ###-####',
  ariaDescription: 'Enter a 10-digit phone number',
  announceChanges: true, // Announces format and changes to screen readers
});
```

### Working with Forms

When used in forms, Tiny Mask automatically separates the displayed masked value from the actual value submitted with the form:

```html
<form id="my-form">
  <input id="phone" name="phone" data-mask="(###) ###-####" />
  <button type="submit">Submit</button>
</form>

<script>
  import { init } from 'tiny-mask';

  init();

  document.getElementById('my-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // formData.get('phone') will return "1234567890" not "(123) 456-7890"
  });
</script>
```

## API Reference

### Core Functions

- `createMask(options)`: Creates a new input mask with custom options
- `init(container, options)`: Initializes masks on inputs with data-mask attributes

### Preset Masks

- `createDateMask(options?)`: Creates a date mask (MM/DD/YYYY)
- `createPhoneMask(options?)`: Creates a phone mask ((XXX) XXX-XXXX)
- `createCardMask(options?)`: Creates a credit card mask (XXXX XXXX XXXX XXXX)
- `createTimeMask(options?)`: Creates a time mask (HH:MM)
- `createIpMask(options?)`: Creates an IP address mask (XXX.XXX.XXX.XXX)

### Mask Instance Methods

- `mount(element)`: Attaches the mask to an input element
- `unmount()`: Removes the mask from the input element
- `getValue()`: Gets the current raw value
- `setValue(value)`: Sets a new value
- `updateOptions(options)`: Updates mask options
- `destroy()`: Cleans up resources used by the mask

## License

MIT
