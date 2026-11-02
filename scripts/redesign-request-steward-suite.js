const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');

// SVG replacement snippets for clean monochrome icons
const docIconSvg = '<svg class="w-4 h-4 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
const searchIconSvg = '<svg class="w-3.5 h-3.5 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';
const infoIconSvg = '<svg class="w-4 h-4 text-neutral-400 inline-block align-middle mr-1" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

const files = [
  'mm_request_material.html',
  'mm_datasteward.html',
  'bp_create_vendor.html',
  'bp_create_customer.html',
  'bp_banksteward.html',
  'ir_create_request.html',
  'part_request.html'
];

files.forEach(file => {
  const filePath = path.join(mdgDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Link mdg-theme.css in head
  if (!html.includes('href="css/mdg-theme.css"')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/mdg-theme.css">\n</head>');
  }

  // 2. Ensure Inter font everywhere
  html = html.replace(/family=Plus\+Jakarta\+Sans[^"']+/g, 'family=Inter:wght@300;400;500;600;700;800');
  html = html.replace(/'Plus Jakarta Sans',/g, "'Inter',");
  html = html.replace(/'Plus Jakarta Sans'/g, "'Inter'");
  html = html.replace(/'Google Sans',/g, "'Inter',");
  html = html.replace(/'Open Sans',/g, "'Inter',");

  // 3. Body backgrounds: neutralize radial gradients
  html = html.replace(/background-image:\s*radial-gradient\([\s\S]*?\);/gi, 'background: var(--mdg-canvas);');
  html = html.replace(/background-color:\s*#eef2f6;/gi, 'background-color: var(--mdg-canvas);');
  html = html.replace(/background-color:\s*#f7f9f8;/gi, 'background-color: var(--mdg-canvas);');
  html = html.replace(/background-color:\s*#f8fafc;/gi, 'background-color: var(--mdg-canvas);');
  html = html.replace(/background:\s*#f7faf9;/gi, 'background: var(--mdg-canvas);');

  // 4. Hero Banners: replace forest green and colorful gradients with minimalist surface
  html = html.replace(
    /\.hero-banner\s*\{[\s\S]*?background:\s*(#184434|linear-gradient\([^;]+\));[\s\S]*?box-shadow:[^;]+;\s*\}/gi,
    `.hero-banner {
                width: 100%;
                background: var(--mdg-surface-subtle);
                border-bottom: 1px solid var(--mdg-border);
                padding: 32px 24px 28px 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: none;
            }`
  );
  html = html.replace(/background:\s*#184434\s*;?/gi, 'background: var(--mdg-surface-subtle);');
  html = html.replace(/background:\s*#0f3325\s*;?/gi, 'background: var(--mdg-surface-subtle);');

  // Hero section titles & subtitles
  html = html.replace(/color:\s*#52b788\s*!important;/gi, 'color: var(--mdg-text-muted) !important;');
  html = html.replace(/color:\s*#74c69d\s*!important;/gi, 'color: var(--mdg-text-muted) !important;');
  html = html.replace(/color:\s*#047857\s*!important;/gi, 'color: var(--mdg-text-muted) !important;');
  html = html.replace(/color:\s*#ffffff\s*!important;\s*margin:\s*0;\s*line-height:[^;]+;/gi, 'color: var(--mdg-text-primary) !important; margin: 0; line-height: 1.25;');

  // 5. Brand Logos in header
  html = html.replace(
    /bg-\[#184434\] text-white flex items-center justify-center font-bold text-xs shadow-xs/g,
    'bg-neutral-900 text-white border border-neutral-700 dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs rounded-md'
  );
  html = html.replace(
    /background:\s*linear-gradient\(135deg,\s*#0284c7\s*0%,\s*#0369a1\s*100%\);/gi,
    'background: var(--mdg-btn-primary-bg); color: var(--mdg-btn-primary-text);'
  );
  html = html.replace(
    /background:\s*linear-gradient\(135deg,\s*#0284c7\s*0%,\s*#0369a1\s*50%,\s*#0c4a6e\s*100%\);/gi,
    'background: var(--mdg-btn-primary-bg); color: var(--mdg-btn-primary-text);'
  );
  html = html.replace(/box-shadow:\s*0 4px 12px rgba\(2, 132, 199, [^)]+\);/gi, 'box-shadow: none;');

  // 6. Primary and emerald buttons
  html = html.replace(/\bbg-emerald-600 hover:bg-emerald-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-emerald-500 hover:bg-emerald-600\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-emerald-700 hover:bg-emerald-800\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-blue-600 hover:bg-blue-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');
  html = html.replace(/\bbg-sky-600 hover:bg-sky-700\b/g, 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900');

  // 7. Focus outlines from emerald to neutral
  html = html.replace(/focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500\/15/g, 'focus:border-neutral-900 focus:ring-1 focus:ring-neutral-400');
  html = html.replace(/border-color:\s*#059669;/g, 'border-color: var(--mdg-border-focus);');
  html = html.replace(/box-shadow:\s*0 0 0 3px rgba\(16, 185, 129, 0\.15\);/g, 'box-shadow: 0 0 0 1px var(--mdg-border-focus);');

  // 8. Badges & status pills
  html = html.replace(/\btext-emerald-700\b/g, 'text-neutral-600 dark:text-neutral-400');
  html = html.replace(/\btext-emerald-600\b/g, 'text-neutral-600 dark:text-neutral-400');
  html = html.replace(/\bbg-emerald-100\b/g, 'bg-neutral-100 dark:bg-neutral-800');
  html = html.replace(/\bbg-emerald-50\b/g, 'bg-neutral-50 dark:bg-neutral-850');
  html = html.replace(/\bborder-emerald-200\b/g, 'border-neutral-200 dark:border-neutral-700');
  html = html.replace(/\bborder-emerald-300\b/g, 'border-neutral-300 dark:border-neutral-700');
  html = html.replace(/\bborder-emerald-500\b/g, 'border-neutral-400 dark:border-neutral-600');
  html = html.replace(/background:\s*#f0f9ff;\s*border:\s*1px solid #bae6fd;\s*color:\s*#0284c7;/g,
    'background: var(--mdg-surface-subtle); border: 1px solid var(--mdg-border); color: var(--mdg-text-secondary);');
  html = html.replace(/background:\s*#0284c7;\s*box-shadow:\s*0 0 0 2px rgba\(2, 132, 199, 0\.25\);/g,
    'background: var(--mdg-text-secondary); box-shadow: 0 0 0 1px var(--mdg-border);');

  // 9. Specific cleanups for part_request.html
  if (file === 'part_request.html') {
    // Remove ⚡ from table headers
    html = html.replace(/⚡/g, '');
    // Clean amber and colored headers to clean neutral headers
    html = html.replace(/border-amber-300 bg-amber-100\/90 text-center text-amber-950/g, 'border-slate-200 bg-slate-100/95 text-center text-slate-800 font-semibold');
    html = html.replace(/border-amber-300 bg-amber-100\/70 text-center text-amber-950/g, 'border-slate-200 bg-slate-100/95 text-center text-slate-800 font-semibold');
    html = html.replace(/border-amber-200 bg-amber-50\/70 text-amber-900/g, 'border-slate-200 bg-slate-50/90 text-slate-700 font-medium');
    html = html.replace(/border-emerald-300 bg-emerald-100\/80 text-center text-\[10\.5px\] text-emerald-900/g, 'border-slate-200 bg-slate-100/95 text-center text-[10.5px] text-slate-800 font-semibold');
    html = html.replace(/border-blue-300 bg-blue-100\/80 text-center text-\[10\.5px\] text-blue-900/g, 'border-slate-200 bg-slate-100/95 text-center text-[10.5px] text-slate-800 font-semibold');
    html = html.replace(/⚠️/g, '');
    html = html.replace(/⚠/g, '');
    html = html.replace(/📊/g, docIconSvg);
  }

  // 10. Specific cleanups for mm_request_material.html & mm_datasteward.html & ir_create_request.html
  html = html.replace(/<span>🎯<\/span>/g, infoIconSvg);
  html = html.replace(/<span>🏷️<\/span>/g, docIconSvg);
  html = html.replace(/<span>💡/g, '<span>' + infoIconSvg);
  html = html.replace(/📋/g, docIconSvg);
  html = html.replace(/📊/g, docIconSvg);
  html = html.replace(/📄/g, docIconSvg);
  html = html.replace(/<span class="absolute left-2.5 top-2 text-slate-400 text-xs">🔍<\/span>/g, '<span class="absolute left-2.5 top-2 text-slate-400 text-xs">' + searchIconSvg + '</span>');
  html = html.replace(/<span[^>]*>🔍<\/span>/g, searchIconSvg);
  html = html.replace(/✓\s*/g, '');

  // Clean log emojis if any
  html = html.replace(/💥/g, '[ERROR]');
  html = html.replace(/📤/g, '[SEND]');
  html = html.replace(/📦/g, '[PAYLOAD]');
  html = html.replace(/✅/g, '[OK]');
  html = html.replace(/⚠️/g, '[WARN]');
  html = html.replace(/❌/g, '[FAIL]');
  html = html.replace(/🚨/g, '[ALERT]');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Successfully redesigned ${file}`);
});
