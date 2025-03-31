import { html, TemplateResult } from 'lit';
import { createDateMask } from '../index';

export default {
  title: 'Tiny Mask/Date Validation',
  parameters: {
    layout: 'centered',
  },
};

export const DateValidation = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="date-input">Date (DD/MM/YYYY):</label>
          <input 
            id="date-input" 
            class="form-input" 
            placeholder="DD/MM/YYYY" 
          />
          <div style="margin-top: 16px;">
            <span>Raw Value: </span>
            <span id="date-raw-value"></span>
          </div>
          <div>
            <span>Valid: </span>
            <span id="date-validity"></span>
          </div>
        </div>
      </form>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const input = canvasElement.querySelector('#date-input') as HTMLInputElement;
    const rawValue = canvasElement.querySelector('#date-raw-value') as HTMLElement;
    const validity = canvasElement.querySelector('#date-validity') as HTMLElement;

    const mask = createDateMask({
      mask: 'DD/MM/YYYY',
      validate: (value) => {
        if (value.length !== 8) return false;
        
        const day = parseInt(value.substring(0, 2), 10);
        const month = parseInt(value.substring(2, 4), 10);
        const year = parseInt(value.substring(4), 10);
        
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 1900 || year > 2100) return false;
        
        if ([4, 6, 9, 11].includes(month) && day > 30) return false;
        
        if (month === 2) {
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          if (day > (isLeapYear ? 29 : 28)) return false;
        }
        
        return true;
      },
      onChange: (value) => {
        rawValue.textContent = value || '';
        
        const validation = mask.validate();
        validity.textContent = validation.isValid ? 'Yes ✓' : 'No ✗';
        validity.style.color = validation.isValid ? 'green' : 'red';
      }
    });

    mask.mount(input);
    
    validity.textContent = 'No ✗';
    validity.style.color = 'red';
  },
};

export const ISODateFormat = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="iso-date">ISO Date (YYYY-MM-DD):</label>
          <input 
            id="iso-date" 
            class="form-input" 
            placeholder="YYYY-MM-DD" 
          />
          <div style="margin-top: 16px;">
            <span>Valid: </span>
            <span id="iso-validity"></span>
          </div>
        </div>
      </form>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const isoInput = canvasElement.querySelector('#iso-date') as HTMLInputElement;
    const isoValidity = canvasElement.querySelector('#iso-validity') as HTMLElement;
    
    const isoMask = createDateMask({
      mask: 'YYYY-MM-DD',
      validate: (value) => {
        if (value.length !== 8) return false;
        
        const year = parseInt(value.substring(0, 4), 10);
        const month = parseInt(value.substring(4, 6), 10);
        const day = parseInt(value.substring(6, 8), 10);
        
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 1900 || year > 2100) return false;
        
        const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
          daysInMonth[2] = 29;
        }
        
        return day <= daysInMonth[month];
      },
      onChange: () => {
        const validation = isoMask.validate();
        isoValidity.textContent = validation.isValid ? 'Yes ✓' : 'No ✗';
        isoValidity.style.color = validation.isValid ? 'green' : 'red';
      }
    });
    
    isoMask.mount(isoInput);
    
    isoValidity.textContent = 'No ✗';
    isoValidity.style.color = 'red';
  }
};

export const EuropeanDateFormat = {
  render: (): TemplateResult => {
    return html`
      <form class="pure-form pure-form-stacked">
        <div class="pure-control-group">
          <label for="euro-date">European Date (DD.MM.YYYY):</label>
          <input 
            id="euro-date" 
            class="form-input" 
            placeholder="DD.MM.YYYY" 
          />
          <div style="margin-top: 16px;">
            <span>Valid: </span>
            <span id="euro-validity"></span>
          </div>
        </div>
      </form>
    `;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const euroInput = canvasElement.querySelector('#euro-date') as HTMLInputElement;
    const euroValidity = canvasElement.querySelector('#euro-validity') as HTMLElement;
    
    const euroMask = createDateMask({
      mask: 'DD.MM.YYYY',
      validate: (value) => {
        if (value.length !== 8) return false;
        
        const day = parseInt(value.substring(0, 2), 10);
        const month = parseInt(value.substring(2, 4), 10);
        const year = parseInt(value.substring(4, 8), 10);
        
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        if (year < 1900 || year > 2100) return false;
        
        if ([4, 6, 9, 11].includes(month) && day > 30) return false;
        
        if (month === 2) {
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          if (day > (isLeapYear ? 29 : 28)) return false;
        }
        
        return true;
      },
      onChange: () => {
        const validation = euroMask.validate();
        euroValidity.textContent = validation.isValid ? 'Yes ✓' : 'No ✗';
        euroValidity.style.color = validation.isValid ? 'green' : 'red';
      }
    });
    
    euroMask.mount(euroInput);
    
    euroValidity.textContent = 'No ✗';
    euroValidity.style.color = 'red';
  }
};