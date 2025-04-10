export default function Header() {
    return (
      <header>
        <div class="container">
          <h1>Tiny Mask</h1>
          <p>A lightweight, customizable input mask library</p>
          <div class="buttons">
            <a href="https://github.com/wannesdebacker/tiny-mask" class="button">GitHub</a>
            <a href="#docs" class="button primary">Documentation</a>
          </div>
        </div>
        <style>
        {`
          header {
            background: var(--secondary);
            color: white;
            padding: 4rem 0;
            text-align: center;
          }
          
          header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .buttons {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
          
          .button {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: transparent;
            color: white;
            border: 2px solid white;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          
          .button:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .button.primary {
            background: var(--primary);
            border-color: var(--primary);
          }
          
          .button.primary:hover {
            background: #2980b9;
          }
        `}
        </style>
      </header>
    );
  }