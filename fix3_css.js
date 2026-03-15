const fs = require('fs');

const cssPath = 'c:\\Users\\asmit\\OneDrive\\Desktop\\demap\\css\\main.css';
let css = fs.readFileSync(cssPath, 'utf8');

css += `
/* Swipeable Reviews & Layout updates */
#home-testi-grid {
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  gap: 16px !important;
  padding: 10px 10px 30px !important;
  scrollbar-width: none !important;
  -webkit-overflow-scrolling: touch !important;
  scroll-snap-type: x mandatory !important;
}
#home-testi-grid::-webkit-scrollbar {
  display: none !important;
}
#home-testi-grid .testi-card {
  flex: 0 0 320px !important;
  scroll-snap-align: start !important;
}

@media (max-width: 480px) {
  #home-testi-grid .testi-card {
    flex: 0 0 280px !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Appended swappable reviews and layout override and rules');
