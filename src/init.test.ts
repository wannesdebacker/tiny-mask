import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { init, update, destroy, destroyAll } from './init';

describe('Init Tests', () => {
  let container: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let documentAppendSpy: any;

  beforeEach(() => {
    // Create a container for test inputs
    container = document.createElement('div');
    document.body.appendChild(container);

    // Spy on document.body.appendChild to track DOM manipulation
    documentAppendSpy = vi.spyOn(document.body, 'appendChild');
  });

  afterEach(() => {
    // Clean up the container and destroy all masks
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    destroyAll();
    documentAppendSpy.mockRestore();
  });

  it('should handle removal of elements during update', () => {
    // Create test inputs
    container.innerHTML = `
      <input data-mask="##/##/####" id="date-input" />
      <input data-mask="(###) ###-####" id="phone-input" />
    `;

    const result = init(container);
    expect(result.count).toBe(2);

    // Remove one of the inputs
    const phoneInput = container.querySelector('#phone-input');
    if (phoneInput) {
      container.removeChild(phoneInput);
    }

    // Update should detect the removed element
    const updatedResult = result.update();
    expect(updatedResult.count).toBe(1);
    expect(updatedResult.masks.size).toBe(1);

    // Verify the remaining mask works
    const dateInput = container.querySelector(
      '#date-input',
    ) as HTMLInputElement;
    dateInput.value = '12345678';
    dateInput.dispatchEvent(new Event('input'));
    expect(dateInput.value).toBe('12/34/5678');
  });

  it('should add masks to new elements during update', () => {
    // Create initial input
    container.innerHTML = `<input data-mask="##/##/####" id="date-input" />`;

    const result = init(container);
    expect(result.count).toBe(1);

    // Add new input
    const newInput = document.createElement('input');
    newInput.setAttribute('data-mask', '(###) ###-####');
    newInput.id = 'phone-input';
    container.appendChild(newInput);

    // Update should detect the new element
    const updatedResult = result.update();
    expect(updatedResult.count).toBe(2);
    expect(updatedResult.masks.size).toBe(2);

    // Verify the new mask works
    newInput.value = '1234567890';
    newInput.dispatchEvent(new Event('input'));
    expect(newInput.value).toBe('(123) 456-7890');
  });

  it('should handle custom options during initialization and update', () => {
    // Create test inputs
    container.innerHTML = `
      <input data-custom-attr="##/##/####" id="date-input" />
      <input data-custom-attr="(###) ###-####" id="phone-input" />
    `;

    // Initialize with custom attribute
    const result = init(container, {
      maskAttr: 'data-custom-attr',
      id: 'custom-test-id',
      enableA11yAnnouncements: true,
      addA11yDescriptions: true,
    });

    expect(result.count).toBe(2);
    expect(result.id).toBe('custom-test-id');

    // Update with new options
    const updatedResult = result.update({
      maskAttr: 'data-custom-attr',
      enableA11yAnnouncements: false,
    });

    expect(updatedResult.count).toBe(2);
    expect(updatedResult.id).toBe('custom-test-id');
  });

  it('should handle destroy with unknown id', () => {
    // Try to destroy a non-existent mask group
    const result = destroy('non-existent-id');

    // Should return an empty result with methods
    expect(result.count).toBe(0);
    expect(result.masks.size).toBe(0);
    expect(typeof result.refresh).toBe('function');
    expect(typeof result.update).toBe('function');
    expect(typeof result.destroy).toBe('function');

    // Ensure destroy method doesn't throw
    expect(() => result.destroy()).not.toThrow();
  });

  it('should handle init when registry already has the provided id', () => {
    // First init with custom id
    container.innerHTML = `<input data-mask="##/##/####" id="date-input" />`;
    const customId = 'test-init-id';

    const firstResult = init(container, { id: customId });
    expect(firstResult.count).toBe(1);
    expect(firstResult.id).toBe(customId);

    // Second init with same id should update existing masks
    container.innerHTML += `<input data-mask="(###) ###-####" id="phone-input" />`;

    const secondResult = init(container, { id: customId });
    expect(secondResult.count).toBe(2);
    expect(secondResult.id).toBe(customId);
  });

  it("should handle update with id that doesn't exist", () => {
    // Try to update a non-existent mask group
    const result = update('non-existent-id', document);

    // Should create a new mask group
    expect(result.count).toBe(0); // No masks because no elements match
    expect(typeof result.refresh).toBe('function');
    expect(typeof result.update).toBe('function');
    expect(typeof result.destroy).toBe('function');
  });

  it('should handle complex data attributes and options', () => {
    // Create test inputs with various data attributes
    container.innerHTML = `
      <input 
        data-mask="##/##/####" 
        data-mask-placeholder="*" 
        data-mask-keep-literals="false"
        data-mask-insert-literals="false"
        data-mask-optional-sections="true"
        data-mask-regex-patterns="true"
        id="complex-input" 
      />
    `;

    const result = init(container);
    expect(result.count).toBe(1);

    const input = document.getElementById('complex-input') as HTMLInputElement;
    input.value = '12345678';
    input.dispatchEvent(new Event('input'));

    // Placeholder should be *
    expect(input.value).toBe('12/34/5678');
  });

  // Test multiple init groups and their interactions
  it('should handle multiple independent init groups', () => {
    // Create two separate containers
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    document.body.appendChild(container1);
    document.body.appendChild(container2);

    container1.innerHTML = `<input data-mask="##/##/####" id="date-input" />`;
    container2.innerHTML = `<input data-mask="(###) ###-####" id="phone-input" />`;

    // Initialize two different mask groups
    const result1 = init(container1, { id: 'group1' });
    const result2 = init(container2, { id: 'group2' });

    expect(result1.count).toBe(1);
    expect(result2.count).toBe(1);

    // Destroy only the first group
    result1.destroy();

    // The second group should still be active
    const phoneInput = container2.querySelector(
      '#phone-input',
    ) as HTMLInputElement;
    phoneInput.value = '1234567890';
    phoneInput.dispatchEvent(new Event('input'));
    expect(phoneInput.value).toBe('(123) 456-7890');

    // Clean up
    document.body.removeChild(container1);
    document.body.removeChild(container2);
  });

  // Test edge cases
  it('should handle empty containers', () => {
    // Create an empty container
    const emptyContainer = document.createElement('div');
    document.body.appendChild(emptyContainer);

    const result = init(emptyContainer);
    expect(result.count).toBe(0);
    expect(result.masks.size).toBe(0);

    // Clean up
    document.body.removeChild(emptyContainer);
  });

  it('should handle elements with empty mask attributes', () => {
    container.innerHTML = `<input data-mask="" id="empty-mask-input" />`;

    const result = init(container);
    expect(result.count).toBe(0); // Should not create a mask for empty pattern
  });
});
