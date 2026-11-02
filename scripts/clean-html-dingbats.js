const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');
const files = fs.readdirSync(mdgDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(mdgDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace Dingbat entities with clean text or &times;
  // &#10003; is Checkmark -> remove or replace with space
  html = html.replace(/&#10003;\s*/g, '');
  html = html.replace(/&#10004;\s*/g, '');
  // &#10005; and &#10007; are X marks -> replace with &times; or remove if in button labels
  html = html.replace(/&#10007;\s*/g, '');
  html = html.replace(/&#10006;\s*/g, '');
  html = html.replace(/&#10005;\s*/g, '&times; ');
  html = html.replace(/&#9998;\s*/g, '');

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log('Cleaned HTML dingbat entities successfully!');
