const fs = require('fs');
const content = fs.readFileSync('public/project/MDG/landing_page.html', 'utf8');
const bodyStart = content.indexOf('<body');
const body = content.substring(bodyStart);
const inlineStyles = body.match(/style="[^"]*"/gi) || [];
console.log('Inline styles in body:', inlineStyles.length);
const colorful = inlineStyles.filter(s => /#|rgb|gradient/i.test(s));
console.log('Colorful inline styles in body:', colorful.length);
colorful.slice(0, 20).forEach(s => console.log('  ', s));
