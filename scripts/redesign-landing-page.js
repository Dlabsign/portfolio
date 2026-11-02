const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/project/MDG/landing_page.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Ensure Inter Font and mdg-theme.css in head
if (!html.includes('href="css/mdg-theme.css"')) {
  html = html.replace('</head>', '  <link rel="stylesheet" href="css/mdg-theme.css">\n</head>');
}

// 2. Remove Plus Jakarta Sans and replace font declarations with Inter
html = html.replace(/family=Plus\+Jakarta\+Sans[^"']+/g, 'family=Inter:wght@300;400;500;600;700;800');
html = html.replace(/'Plus Jakarta Sans',/g, "'Inter',");

// 3. Replace all colorful linear-gradients with clean monochrome neutrals
html = html.replace(/background:\s*linear-gradient\([^;]+\);/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/background:\s*radial-gradient\([^;]+\);/gi, 'background: var(--mdg-surface-subtle);');

// 4. Clean up inline styles that have green/blue/purple/amber colors
html = html.replace(/background:\s*#10b981\s*;?/gi, 'background: var(--mdg-btn-primary-bg);');
html = html.replace(/background:\s*#059669\s*;?/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/background:\s*#047857\s*;?/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/background:\s*#0284c7\s*;?/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/background:\s*#7c3aed\s*;?/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/background:\s*#d97706\s*;?/gi, 'background: var(--mdg-surface-subtle);');
html = html.replace(/color:\s*#10b981\s*;?/gi, 'color: var(--mdg-text-primary);');
html = html.replace(/color:\s*#059669\s*;?/gi, 'color: var(--mdg-text-secondary);');
html = html.replace(/color:\s*#38bdf8\s*;?/gi, 'color: var(--mdg-text-primary);');
html = html.replace(/color:\s*#d97706\s*;?/gi, 'color: var(--mdg-text-secondary);');
html = html.replace(/color:\s*#a7f3d0\s*;?/gi, 'color: var(--mdg-text-muted);');

// 5. Update specific style blocks for Minimalist Apple-level precision
// Hero Banner: from deep green to sleek neutral surface
html = html.replace(
  /\.hero-banner\s*\{[^}]*\}/gi,
  `.hero-banner {
          width: 100%;
          background: var(--mdg-surface-subtle);
          border-bottom: 1px solid var(--mdg-border);
          padding: 40px 44px 32px 44px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }`
);

// Hero Section H1 and P
html = html.replace(
  /\.hero-section h1\s*\{[^}]*\}/gi,
  `.hero-section h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--mdg-text-primary);
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }`
);
html = html.replace(
  /\.hero-section p\s*\{[^}]*\}/gi,
  `.hero-section p {
          font-size: 12px;
          font-weight: 500;
          color: var(--mdg-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }`
);

// Top Navbar
html = html.replace(
  /\.top-navbar\s*\{[^}]*\}/gi,
  `.top-navbar {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          background: var(--mdg-surface);
          border-bottom: 1px solid var(--mdg-border);
          z-index: 100;
        }`
);

// Logo icon wrap - pure monochrome
html = html.replace(
  /\.logo-icon-wrap\s*\{[^}]*\}/gi,
  `.logo-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--mdg-btn-primary-bg);
          color: var(--mdg-btn-primary-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
        }`
);

// Analytics Tiles - flat bento style
html = html.replace(
  /\.analytics-tile\s*\{[^}]*\}/gi,
  `.analytics-tile {
          background: var(--mdg-surface);
          border: 1px solid var(--mdg-border);
          border-radius: 8px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: border-color 0.15s ease, transform 0.15s ease;
          box-shadow: var(--mdg-shadow-subtle);
        }`
);

// Analytics Icon Box - monochrome
html = html.replace(
  /\.analytics-icon-box\s*\{[^}]*\}/gi,
  `.analytics-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--mdg-surface-subtle);
          color: var(--mdg-text-primary);
          border: 1px solid var(--mdg-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }`
);

// Entity Cards - flat minimalist bento cards
html = html.replace(
  /\.entity-card\s*\{[^}]*\}/gi,
  `.entity-card {
          background: var(--mdg-surface);
          border: 1px solid var(--mdg-border);
          border-radius: 10px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
          color: var(--mdg-text-primary);
          transition: border-color 0.15s ease, transform 0.15s ease;
          box-shadow: var(--mdg-shadow-subtle);
        }`
);

// Card icon container - monochrome
html = html.replace(
  /\.card-icon-container\s*\{[^}]*\}/gi,
  `.card-icon-container {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: var(--mdg-surface-subtle);
          border: 1px solid var(--mdg-border);
          color: var(--mdg-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }`
);

// SVGs inside card icon container should use currentColor
html = html.replace(/stroke="white"/gi, 'stroke="currentColor"');

// Action modal cards & headers
html = html.replace(
  /\.mat-action-modal-card\s*\{[^}]*\}/gi,
  `.mat-action-modal-card {
          width: 100%;
          max-width: 820px;
          background: var(--mdg-surface);
          border: 1px solid var(--mdg-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--mdg-shadow-modal);
        }`
);

html = html.replace(
  /\.mat-action-modal-header\s*\{[^}]*\}/gi,
  `.mat-action-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--mdg-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--mdg-surface);
        }`
);

html = html.replace(
  /\.mat-action-icon-wrap\s*\{[^}]*\}/gi,
  `.mat-action-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: var(--mdg-surface-subtle);
          border: 1px solid var(--mdg-border);
          color: var(--mdg-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }`
);

html = html.replace(
  /\.mat-action-card-item\s*\{[^}]*\}/gi,
  `.mat-action-card-item {
          background: var(--mdg-surface);
          border: 1px solid var(--mdg-border);
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--mdg-text-primary);
          transition: border-color 0.15s ease;
        }`
);

html = html.replace(
  /\.mat-action-big-icon\s*\{[^}]*\}/gi,
  `.mat-action-big-icon {
          width: 38px;
          height: 38px;
          border-radius: 6px;
          background: var(--mdg-surface-subtle);
          border: 1px solid var(--mdg-border);
          color: var(--mdg-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }`
);

// Neutralize all action pills
html = html.replace(
  /\.mat-action-pill\s*\{[^}]*\}/gi,
  `.mat-action-pill {
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          background: var(--mdg-surface-subtle);
          color: var(--mdg-text-secondary);
          border: 1px solid var(--mdg-border);
        }`
);

// Case study modal styles
html = html.replace(
  /\.cs-modal-card\s*\{[^}]*\}/gi,
  `.cs-modal-card {
          width: 100%;
          max-width: 860px;
          max-height: 86vh;
          background: var(--mdg-surface);
          border: 1px solid var(--mdg-border);
          border-radius: 12px;
          box-shadow: var(--mdg-shadow-modal);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }`
);

html = html.replace(
  /\.cs-modal-header\s*\{[^}]*\}/gi,
  `.cs-modal-header {
          padding: 20px 28px;
          border-bottom: 1px solid var(--mdg-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--mdg-surface);
        }`
);

html = html.replace(
  /\.cs-metrics-banner\s*\{[^}]*\}/gi,
  `.cs-metrics-banner {
          margin-top: 24px;
          padding: 20px 24px;
          border-radius: 8px;
          background: var(--mdg-surface-subtle);
          border: 1px solid var(--mdg-border);
          color: var(--mdg-text-primary);
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 20px;
          flex-wrap: wrap;
        }`
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('landing_page.html successfully redesigned and saved!');
