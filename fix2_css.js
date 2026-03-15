const fs = require('fs');

const cssPath = 'c:\\Users\\asmit\\OneDrive\\Desktop\\demap\\css\\main.css';
let css = fs.readFileSync(cssPath, 'utf8');

css += `
/* Viewport and Layout Fixes from Audit Prompt */
html, body {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

@media (max-width: 768px) {
  .services-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* 2 columns instead of 1 */
    gap: 12px;
  }
  
  .footer-grid {
    grid-template-columns: 1fr 1fr; /* side by side */
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Appended layout fixes to main.css');
