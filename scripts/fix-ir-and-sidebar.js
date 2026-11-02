const fs = require('fs');
const path = require('path');

const irPath = path.join(__dirname, '../public/project/MDG/ir_approval.html');
let ir = fs.readFileSync(irPath, 'utf8');
ir = ir.replace(
  /bg-\[#184434\] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-900/g,
  'bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800'
);
fs.writeFileSync(irPath, ir, 'utf8');

const sbPath = path.join(__dirname, '../public/project/MDG/sidebar.html');
let sb = fs.readFileSync(sbPath, 'utf8');
if (!sb.includes('family=Inter')) {
  sb = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">\n' + sb;
  fs.writeFileSync(sbPath, sb, 'utf8');
}

console.log('Fixed ir_approval and sidebar!');
