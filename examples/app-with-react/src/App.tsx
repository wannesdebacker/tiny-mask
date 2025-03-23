import { useEffect, useRef, useState } from 'react';
import { createMask } from 'tiny-mask';
import { createDateMask, createPhoneMask } from 'tiny-mask/presets';
import './App.css';

const App = () => {
  const dateRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  const [dateValue, setDateValue] = useState('');
  const [dateDisplayValue, setDateDisplayValue] = useState('');

  const [phoneValue, setPhoneValue] = useState('');
  const [phoneDisplayValue, setPhoneDisplayValue] = useState('');

  const [customValue, setCustomValue] = useState('');
  const [customDisplayValue, setCustomDisplayValue] = useState('');

  useEffect(() => {
    if (dateRef.current) {
      const dateMask = createDateMask({
        onChange: (rawValue, maskedValue) => {
          setDateValue(rawValue);
          setDateDisplayValue(maskedValue);
        },
      });
      dateMask.mount(dateRef.current);
      return () => dateMask.destroy();
    }
  }, []);

  useEffect(() => {
    if (phoneRef.current) {
      const phoneMask = createPhoneMask({
        onChange: (rawValue, maskedValue) => {
          setPhoneValue(rawValue);
          setPhoneDisplayValue(maskedValue);
        },
      });
      phoneMask.mount(phoneRef.current);
      return () => phoneMask.destroy();
    }
  }, []);

  useEffect(() => {
    if (customRef.current) {
      const customMask = createMask({
        mask: 'UUUUU-UUUUU-UUUUU-UUUUU',
        placeholder: '_',
        keepLiterals: true,
        onChange: (rawValue, maskedValue) => {
          setCustomValue(rawValue);
          setCustomDisplayValue(maskedValue);
        },
      });
      customMask.mount(customRef.current);
      return () => customMask.destroy();
    }
  }, []);

  return (
    <div className="app">
      <h1>Tiny Mask Example</h1>

      <div className="form">
        <div className="field">
          <label>Date:</label>
          <input ref={dateRef} placeholder="MM/DD/YYYY" />
          <div className="value-display">
            <div>
              Raw: <span className="value">{dateValue}</span>
            </div>
            <div>
              Masked: <span className="value">{dateDisplayValue}</span>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Phone:</label>
          <input ref={phoneRef} placeholder="(XXX) XXX-XXXX" />
          <div className="value-display">
            <div>
              Raw: <span className="value">{phoneValue}</span>
            </div>
            <div>
              Masked: <span className="value">{phoneDisplayValue}</span>
            </div>
          </div>
        </div>

        <div className="field">
          <label>License Key:</label>
          <input ref={customRef} placeholder="_____-_____-_____-_____" />
          <div className="value-display">
            <div>
              Raw: <span className="value">{customValue}</span>
            </div>
            <div>
              Masked: <span className="value">{customDisplayValue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
