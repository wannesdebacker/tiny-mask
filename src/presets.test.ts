import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createDateMask,
  createPhoneMask,
  createCardMask,
  createTimeMask,
  createIpMask,
} from './presets';

describe('Preset Masks', () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement('input');
    document.body.appendChild(input);
  });

  afterEach(() => {
    document.body.removeChild(input);
  });

  it('should create a date mask', () => {
    const mask = createDateMask();
    mask.mount(input);
    input.value = '12345678';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12/34/5678');
  });

  it('should validate date mask input', () => {
    const mask = createDateMask();
    mask.mount(input);

    // Invalid date tests
    input.value = '99/99/9999';
    input.dispatchEvent(new Event('input'));
    const invalidValidation = mask.validate();
    expect(invalidValidation.isValid).toBe(false);

    // Valid date tests
    input.value = '12/31/2023';
    input.dispatchEvent(new Event('input'));
    const validValidation = mask.validate();
    expect(validValidation.isValid).toBe(true);
  });

  it('should create a phone mask', () => {
    const mask = createPhoneMask();
    mask.mount(input);
    input.value = '1234567890';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('(123) 456-7890');
  });

  it('should create a credit card mask', () => {
    const mask = createCardMask();
    mask.mount(input);
    input.value = '1234567890123456';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('1234 5678 9012 3456');
  });

  it('should create a time mask', () => {
    const mask = createTimeMask();
    mask.mount(input);
    input.value = '1230';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('12:30');
  });

  it('should create an IP address mask', () => {
    const mask = createIpMask();
    mask.mount(input);
    input.value = '192168001001';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('192.168.001.001');
  });

  it('should allow custom options for preset masks', () => {
    const dateMask = createDateMask({
      placeholder: '*',
      onChange: (rawValue, maskedValue) => {
        expect(rawValue).toBe('12345678');
        expect(maskedValue).toBe('12/34/5678');
      },
    });

    dateMask.mount(input);
    input.value = '12345678';
    input.dispatchEvent(new Event('input'));
  });

  it('should support custom mask format for date', () => {
    const dateMask = createDateMask({
      mask: 'YYYY-MM-DD',
    });

    dateMask.mount(input);
    input.value = '20231231';
    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('2023-12-31');
  });

  // Additional tests for preset masks
  describe('Advanced Preset Masks', () => {
    it('should support custom date formats with different separators', () => {
      const dateMask = createDateMask({
        mask: 'MM.DD.YYYY',
      });

      dateMask.mount(input);
      input.value = '12312023';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('12.31.2023');
    });

    it('should support different phone number formats', () => {
      const phoneMask = createPhoneMask({
        mask: '+# (###) ###-####',
      });

      phoneMask.mount(input);
      input.value = '11234567890';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('+1 (123) 456-7890');
    });

    it('should support different credit card formats', () => {
      const cardMask = createCardMask({
        mask: '#### #### #### #### ###', // For cards with additional verification digits
      });

      cardMask.mount(input);
      input.value = '1234567890123456789';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('1234 5678 9012 3456 789');
    });

    it('should support 24-hour time format', () => {
      const timeMask = createTimeMask({
        mask: '##:##',
        validate: (value) => {
          if (value.length !== 4) return false;

          const hours = parseInt(value.substring(0, 2), 10);
          const minutes = parseInt(value.substring(2, 4), 10);

          return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
        },
      });

      timeMask.mount(input);

      // Valid time
      input.value = '2345';
      input.dispatchEvent(new Event('input'));
      expect(timeMask.validate().isValid).toBe(true);
      expect(input.value).toBe('23:45');

      // Invalid time
      input.value = '2460';
      input.dispatchEvent(new Event('input'));
      expect(timeMask.validate().isValid).toBe(false);
    });

    it('should validate IP address components', () => {
      const ipMask = createIpMask({
        validate: (value) => {
          if (value.length !== 12) return false;

          const octets = [
            value.substring(0, 3),
            value.substring(3, 6),
            value.substring(6, 9),
            value.substring(9, 12),
          ].map((o) => parseInt(o, 10));

          return octets.every((octet) => octet >= 0 && octet <= 255);
        },
      });

      ipMask.mount(input);

      // Valid IP
      input.value = '192168001001';
      input.dispatchEvent(new Event('input'));
      expect(ipMask.validate().isValid).toBe(true);

      // Invalid IP (octet > 255)
      input.value = '192168001999';
      input.dispatchEvent(new Event('input'));
      expect(ipMask.validate().isValid).toBe(false);
    });
  });
});
