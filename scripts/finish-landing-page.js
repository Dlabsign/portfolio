const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/project/MDG/landing_page.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Tile badge hint in CSS
content = content.replace(
  /color:\s*#047857;\s*background:\s*#d1fae5;\s*padding:\s*3px 10px;\s*border-radius:\s*9999px;\s*margin-left:\s*auto;\s*border:\s*1px solid #a7f3d0;/gi,
  'color: var(--mdg-text-secondary); background: var(--mdg-surface-subtle); padding: 3px 10px; border-radius: 9999px; margin-left: auto; border: 1px solid var(--mdg-border);'
);

// 2. Card action hover shadows & borders
content = content.replace(/box-shadow:\s*0 16px 32px rgba\(2, 132, 199, 0\.16\);/gi, 'box-shadow: var(--mdg-shadow-subtle);');
content = content.replace(/border-color:\s*#0284c7;/gi, 'border-color: var(--mdg-text-primary);');
content = content.replace(/box-shadow:\s*0 16px 32px rgba\(124, 58, 237, 0\.16\);/gi, 'box-shadow: var(--mdg-shadow-subtle);');
content = content.replace(/border-color:\s*#7c3aed;/gi, 'border-color: var(--mdg-text-primary);');
content = content.replace(/box-shadow:\s*0 16px 32px rgba\(5, 150, 105, 0\.16\);/gi, 'box-shadow: var(--mdg-shadow-subtle);');
content = content.replace(/box-shadow:\s*0 16px 32px rgba\(217, 119, 6, 0\.16\);/gi, 'box-shadow: var(--mdg-shadow-subtle);');
content = content.replace(/box-shadow:\s*0 16px 32px rgba\(16, 185, 129, 0\.16\);/gi, 'box-shadow: var(--mdg-shadow-subtle);');

// 3. Status badges in JS tables (customer / vendor / plant / chart)
content = content.replace(
  /background:\s*#d1fae5;\s*color:\s*#047857;\s*border:\s*1px solid #a7f3d0;/gi,
  'background: var(--mdg-surface-subtle); color: var(--mdg-text-secondary); border: 1px solid var(--mdg-border);'
);
content = content.replace(
  /color:#047857;\s*background:#d1fae5;/gi,
  'color:var(--mdg-text-secondary); background:var(--mdg-surface-subtle); border:1px solid var(--mdg-border);'
);
content = content.replace(
  /background:#e0f2fe;\s*color:#0369a1;\s*border-color:#bae6fd;/gi,
  'background:var(--mdg-surface-subtle); color:var(--mdg-text-primary); border-color:var(--mdg-border);'
);

// 4. Chart monochrome palette
content = content.replace(
  /'#0284c7',\s*'#0d9488',\s*'#16a34a',\s*'#d97706',\s*'#dc2626',\s*'#7c3aed',\s*'#c026d3',\s*'#2563eb',\s*'#059669',\s*'#ca8a04',\s*'#e11d48',\s*'#9333ea',\s*'#4f46e5',\s*'#0891b2',\s*'#65a30d'/gi,
  "'#111827', '#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8'"
);

// 5. Pagination active style
content = content.replace(
  /'background: var\(--mdg-surface-subtle\); color:#ffffff; border-color:#0284c7; font-weight:700;'/g,
  "'background: var(--mdg-btn-primary-bg); color: var(--mdg-btn-primary-text); border-color: var(--mdg-btn-primary-bg); font-weight:600;'"
);

// 6. Remaining green/blue text colors
content = content.replace(/color:\s*#047857;?/gi, 'color: var(--mdg-text-primary);');
content = content.replace(/color:\s*#0284c7;?/gi, 'color: var(--mdg-text-primary);');

fs.writeFileSync(filePath, content, 'utf8');
console.log('landing_page.html finished successfully!');
