const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');
const sidebarHtml = fs.readFileSync(path.join(mdgDir, 'sidebar.html'), 'utf8');

// SVG replacement snippets for emojis
const docIconSvg = '<svg class="w-4 h-4 text-neutral-400 inline-block align-middle mr-1.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
const searchIconSvg = '<svg class="w-3.5 h-3.5 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';
const clipIconSvg = '<svg class="w-3.5 h-3.5 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>';

const approvalFiles = [
  'mm_approval.html',
  'bp_approval.html',
  'ir_approval.html',
  'part_approval.html',
  'history_approved.html',
  'history_rejected.html'
];

approvalFiles.forEach(file => {
  const filePath = path.join(mdgDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Link mdg-theme.css in head
  if (!html.includes('href="css/mdg-theme.css"')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/mdg-theme.css">\n</head>');
  }

  // 2. Ensure Inter font
  html = html.replace(/family=Plus\+Jakarta\+Sans[^"']+/g, 'family=Inter:wght@300;400;500;600;700;800');
  html = html.replace(/'Plus Jakarta Sans',/g, "'Inter',");
  html = html.replace(/'Google Sans',/g, "'Inter',");
  html = html.replace(/'Open Sans',/g, "'Inter',");

  // 3. Neutralize Tailwind Emerald/Brand configs
  html = html.replace(
    /colors:\s*\{[\s\S]*?emerald:\s*\{[\s\S]*?\}[\s\S]*?\}/gi,
    "colors: { brand: { 50: '#f8f9fa', 100: '#f1f3f5', 500: '#111827', 600: '#0f172a', 700: '#020617' } }"
  );

  // 4. Clean body background gradients
  html = html.replace(/background-image:\s*radial-gradient\([\s\S]*?\);/gi, 'background: var(--mdg-canvas);');
  html = html.replace(/background-color:\s*#f8fafc;/gi, 'background-color: var(--mdg-canvas);');

  // 5. Replace embedded aside block with clean sidebarHtml
  const asideStart = html.indexOf('<aside');
  const asideEnd = html.indexOf('</aside>');
  if (asideStart !== -1 && asideEnd !== -1) {
    // Find if there was any trailing whitespace or fragment before next element
    html = html.slice(0, asideStart) + sidebarHtml + html.slice(asideEnd + 8);
  }

  // 6. Neutralize top header logo
  html = html.replace(
    /bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shadow-xs/g,
    'bg-neutral-900 text-white border border-neutral-700 dark:bg-white dark:text-neutral-900 font-extrabold text-xs flex items-center justify-center rounded-md'
  );

  // 7. Clean action buttons (Approve, Reject, Filter)
  html = html.replace(/\bbg-emerald-600 hover:bg-emerald-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-emerald-500 hover:bg-emerald-600\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-sky-600 hover:bg-sky-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-purple-600 hover:bg-purple-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');

  // 8. Clean colorful badges
  html = html.replace(/\bbg-emerald-100 text-emerald-800\b/g, 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-emerald-50 text-emerald-700\b/g, 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-sky-100 text-sky-800\b/g, 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-sky-50 text-sky-700\b/g, 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-amber-100 text-amber-800\b/g, 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-amber-50 text-amber-700\b/g, 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');
  html = html.replace(/\bbg-rose-100 text-rose-800\b/g, 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200');

  // 9. Replace emojis outside sidebar
  html = html.replace(/📋/g, docIconSvg);
  html = html.replace(/📑/g, docIconSvg);
  html = html.replace(/📄/g, docIconSvg);
  html = html.replace(/🖼️/g, docIconSvg);
  html = html.replace(/📎/g, clipIconSvg);
  html = html.replace(/🔍/g, searchIconSvg);
  html = html.replace(/👁\s*View/g, 'View');
  html = html.replace(/👁\s*Preview/g, 'Preview');
  html = html.replace(/👁\s*Lihat/g, 'Lihat');
  html = html.replace(/↺\s*Normal/g, 'Normal');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Successfully redesigned ${file}`);
});
