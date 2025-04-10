import { createSignal, onMount } from 'solid-js';
import { createCardMask } from 'fairly-tiny-mask';

export default function CardMask() {
  const [value, setValue] = createSignal('');
  const [formattedValue, setFormattedValue] = createSignal('');
  let inputRef: HTMLInputElement | undefined = undefined;
  
  onMount(() => {
    // Check if inputRef is set before using it
    if (inputRef) {
      const mask = createCardMask({
        onChange: (rawValue, maskedValue) => {
          setValue(rawValue || '');
          setFormattedValue(maskedValue || '');
        }
      });
      
      mask.mount(inputRef);
    }
  });
  
  return (
    <div>
      <input 
        ref={inputRef} 
        placeholder="XXXX XXXX XXXX XXXX" 
        class="demo-input" 
      />
      <div class="demo-info">
        <div>Raw value: {value()}</div>
        <div>Formatted value: {formattedValue()}</div>
      </div>
    </div>
  );
}