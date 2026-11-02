const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');
const clipSvg = '<svg class="w-3.5 h-3.5 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>';
const searchSvg = '<svg class="w-3.5 h-3.5 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';

// 1. ir_approval.html
const irAppPath = path.join(mdgDir, 'ir_approval.html');
let irAppHtml = fs.readFileSync(irAppPath, 'utf8');
irAppHtml = irAppHtml.replace(
  /class="bg-\[#184434\] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800"/g,
  'class="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800"'
);
fs.writeFileSync(irAppPath, irAppHtml, 'utf8');

// 2. landing_page.html
const lpPath = path.join(mdgDir, 'landing_page.html');
let lpHtml = fs.readFileSync(lpPath, 'utf8');
lpHtml = lpHtml.replace(
  /\.card-material,\s*\.card-business-partner,\s*\.card-financial,\s*\.card-customer,\s*\.card-supplier,\s*\.card-agentic\s*\{\s*background:\s*#184434;\s*\}/g,
  `.card-material,
        .card-business-partner,
        .card-financial,
        .card-customer,
        .card-supplier,
        .card-agentic {
          background: var(--mdg-surface);
        }`
);
lpHtml = lpHtml.replace(
  /\.entity-card:hover\s*\{[\s\S]*?\}/g,
  `.entity-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--mdg-shadow-subtle);
          border-color: var(--mdg-border-strong);
        }`
);
fs.writeFileSync(lpPath, lpHtml, 'utf8');

// 3. mm_datasteward.html
const dsPath = path.join(mdgDir, 'mm_datasteward.html');
let dsHtml = fs.readFileSync(dsPath, 'utf8');
dsHtml = dsHtml.replace(
  /<span class="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">📎<\/span>/g,
  '<span class="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">' + clipSvg + '</span>'
);
dsHtml = dsHtml.replace(/🔍/g, searchSvg);
dsHtml = dsHtml.replace(/iconEl\.innerText = '✕';/g, "iconEl.innerText = 'X';");
fs.writeFileSync(dsPath, dsHtml, 'utf8');

// 4. mm_request_material.html
const mmReqPath = path.join(mdgDir, 'mm_request_material.html');
let mmReqHtml = fs.readFileSync(mmReqPath, 'utf8');
mmReqHtml = mmReqHtml.replace(
  /<span class="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">📎<\/span>/g,
  '<span class="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-bold text-xs">' + clipSvg + '</span>'
);
mmReqHtml = mmReqHtml.replace(
  /class="w-5 h-5 rounded-full bg-\[#184434\] text-white flex items-center justify-center font-bold text-\[10px\]"/g,
  'class="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-[10px]"'
);
mmReqHtml = mmReqHtml.replace(
  /class="w-8 h-8 rounded-xl bg-\[#184434\] text-white font-extrabold text-xs flex items-center justify-center shadow-xs"/g,
  'class="w-8 h-8 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-extrabold text-xs flex items-center justify-center"'
);
mmReqHtml = mmReqHtml.replace(
  /bg-white\/10 hover:bg-white\/20 text-emerald-200 border border-emerald-400\/30/g,
  'bg-neutral-900/5 hover:bg-neutral-900/10 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
);
mmReqHtml = mmReqHtml.replace(
  /bg-emerald-500 animate-pulse/g,
  'bg-neutral-600 dark:bg-neutral-400 animate-pulse'
);
mmReqHtml = mmReqHtml.replace(
  /text-emerald-800 border border-neutral-200 dark:border-neutral-700/g,
  'text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
);
fs.writeFileSync(mmReqPath, mmReqHtml, 'utf8');

// 5. sidebar.html
const sbPath = path.join(mdgDir, 'sidebar.html');
let sbHtml = fs.readFileSync(sbPath, 'utf8');
if (!sbHtml.includes('href="css/mdg-theme.css"')) {
  sbHtml = '<link rel="stylesheet" href="css/mdg-theme.css">\n' + sbHtml;
  fs.writeFileSync(sbPath, sbHtml, 'utf8');
}

console.log('Cleaned remaining detail lines successfully!');
