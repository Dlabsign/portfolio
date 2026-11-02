const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');
const files = fs.readdirSync(mdgDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(mdgDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace Dingbats
  html = html.replace(/✓\s*/g, '');
  html = html.replace(/✗\s*/g, '');
  html = html.replace(/✕\s*/g, '');

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log('Cleaned dingbats across all MDG files successfully!');
