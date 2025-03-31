export default function Footer() {
    return (
      <footer>
        <div class="container">
          <p>Released under MIT License</p>
        </div>
        <style>
        {`
          footer {
            background: var(--secondary);
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 2rem;
          }
        `}
        </style>
      </footer>
    );
  }