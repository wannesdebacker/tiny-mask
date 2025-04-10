/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import DateMask from './examples/DateMask';
import PhoneMask from './examples/PhoneMask';
import CardMask from './examples/CardMask';

const App = () => {
  return (
    <div class="app">
      <Header />
      
      <main class="container">
        <section id="demo">
          <h2>Try it out</h2>
          <div class="demo-grid">
            <div class="demo-card">
              <h3>Date (DD/MM/YYYY)</h3>
              <DateMask />
            </div>
            <div class="demo-card">
              <h3>Phone Number</h3>
              <PhoneMask />
            </div>
            <div class="demo-card">
              <h3>Credit Card</h3>
              <CardMask />
            </div>
          </div>
        </section>

        <section id="install">
          <h2>Installation</h2>
          <pre><code>pnpm add tiny-mask</code></pre>
          <p>Or use directly in browser:</p>
          <pre><code>&lt;script src="https://cdn.jsdelivr.net/npm/tiny-mask@1.0.0/dist/tiny-mask.js"&gt;&lt;/script&gt;</code></pre>
        </section>

        <section id="docs">
          <h2>Documentation</h2>
          <div class="doc-section">
            <h3>Basic Usage</h3>
            <pre><code>{`// Declarative (HTML attributes)
<input data-mask="##/##/####" placeholder="DD/MM/YYYY" />

<script>
  import { init } from 'tiny-mask';
  init(); // Initialize all inputs with data-mask
</script>

// Programmatic (JavaScript)
import { createDateMask } from 'tiny-mask';

const dateInput = document.getElementById('date-input');
const dateMask = createDateMask();
dateMask.mount(dateInput);`}</code></pre>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

render(() => <App />, document.getElementById('root')!);