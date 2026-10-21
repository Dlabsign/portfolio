const fs = require('fs');
const path = require('path');

const mdgDir = path.join(__dirname, '../public/project/MDG');

// 1. Update mdg-runtime.js in MDG/js/
const runtimeFile = path.join(mdgDir, 'js/mdg-runtime.js');
if (fs.existsSync(runtimeFile)) {
  let runtimeContent = fs.readFileSync(runtimeFile, 'utf8');
  runtimeContent = runtimeContent.replace(
    /const ROOT_PATH = '\/project\/MASTER DATA GOVERNANCE';/g,
    "const ROOT_PATH = '/project/MDG';"
  );
  runtimeContent = runtimeContent.replace(
    /MATERIAL MASTER\/landing\/landing_page\.htm/g,
    'landing_page.html'
  );
  runtimeContent = runtimeContent.replace(/\.htm/g, '.html');
  fs.writeFileSync(runtimeFile, runtimeContent, 'utf8');
  console.log('Updated mdg-runtime.js ROOT_PATH to /project/MDG');
}

// 2. Process all .htm files in public/project/MDG
const files = fs.readdirSync(mdgDir);

files.forEach((file) => {
  if (!file.endsWith('.htm')) return;

  const fullPath = path.join(mdgDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Check for dummy 403 Forbidden header
  if (content.includes('403 Forbidden') || content.includes('Access Forbidden')) {
    const secondDocType = content.indexOf('<!DOCTYPE html>', 20);
    if (secondDocType !== -1) {
      console.log(`Stripping 403 header from ${file} at index ${secondDocType}`);
      content = content.substring(secondDocType);
    }
  }

  // If sidebar file, remove ABAP tags and replace variables
  if (file.startsWith('sidebar')) {
    content = content.replace(/<%@page language="ABAP" %>[\s\S]*?%>/g, '');
    content = content.replace(/<%=\s*lv_sb_mat_pending\s*%>/g, '3');
    content = content.replace(/<%=\s*lv_sb_bp_pending\s*%>/g, '2');
    content = content.replace(/<%=\s*lv_sb_ir_pending\s*%>/g, '1');
    content = content.replace(/<%=\s*lv_sb_approved\s*%>/g, '18');
    content = content.replace(/<%=\s*lv_sb_rejected\s*%>/g, '4');
    content = content.replace(/<%=\s*sy-uname\s*%>/g, 'ADMIN_MDG');
  }

  // Update script tags to point to js/mdg-runtime.js
  content = content.replace(/src="\.\.\/\.\.\/js\/mdg-runtime\.js"/g, 'src="js/mdg-runtime.js"');
  content = content.replace(/src="\.\.\/js\/mdg-runtime\.js"/g, 'src="js/mdg-runtime.js"');

  // Ensure js/mdg-runtime.js is included in <head> if not already
  if (!content.includes('mdg-runtime.js') && content.includes('</head>')) {
    content = content.replace('</head>', '  <script src="js/mdg-runtime.js"></script>\n</head>');
  }

  // Replace old relative paths to flat folder structure
  const pathReplacements = [
    // Complex paths with spaces
    { from: /\/project\/MASTER DATA GOVERNANCE\/MATERIAL MASTER\/landing\/landing_page\.htm/g, to: 'landing_page.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/MATERIAL MASTER\/landing\/landing_page\.html/g, to: 'landing_page.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/Approval\/mm_approval\/mm_approval\.htm/g, to: 'mm_approval.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/Approval\/bp_approval\/bp_approval\.htm/g, to: 'bp_approval.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/Approval\/ir_approval\/ir_approval\.htm/g, to: 'ir_approval.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/MATERIAL MASTER\/datasteward\/mm_datasteward\.htm/g, to: 'mm_datasteward.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/BUSINESS PARTNER\/bp_datasteward\/bp_datasteward\.htm/g, to: 'bp_create_vendor.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/BUSINESS PARTNER\/bp_banksteward\/bp_banksteward\.htm/g, to: 'bp_banksteward.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/MATERIAL MASTER\/HIST_APPROVED\/history_approved\.htm/g, to: 'history_approved.html' },
    { from: /\/project\/MASTER DATA GOVERNANCE\/MATERIAL MASTER\/HIST_REJECTED\/history_rejected\.htm/g, to: 'history_rejected.html' },

    // Relative paths
    { from: /\.\.\/Request Material\/mm_request_material\.htm/g, to: 'mm_request_material.html' },
    { from: /\.\.\/datasteward\/mm_datasteward\.htm/g, to: 'mm_datasteward.html' },
    { from: /\.\.\/\.\.\/Approval\/mm_approval\/mm_approval\.htm/g, to: 'mm_approval.html' },
    { from: /\.\.\/\.\.\/BUSINESS PARTNER\/bp_create_vendor\/bp_create_vendor\.htm/g, to: 'bp_create_vendor.html' },
    { from: /\.\.\/\.\.\/BUSINESS PARTNER\/bp_create_customer\/bp_create_customer\.htm/g, to: 'bp_create_customer.html' },
    { from: /\.\.\/\.\.\/BUSINESS PARTNER\/bp_banksteward\/bp_banksteward\.htm/g, to: 'bp_banksteward.html' },
    { from: /\.\.\/\.\.\/Approval\/bp_approval\/bp_approval\.htm/g, to: 'bp_approval.html' },
    { from: /\.\.\/\.\.\/FINANCE\/ir_create_request\.htm/g, to: 'ir_create_request.html' },
    { from: /\.\.\/\.\.\/Approval\/ir_approval\/ir_approval\.htm/g, to: 'ir_approval.html' },
    { from: /\.\.\/\.\.\/PENJUALAN\/part_request\/part_request\.htm/g, to: 'part_request.html' },
    { from: /\.\.\/\.\.\/PENJUALAN\/Approval\/part_approval\.htm/g, to: 'part_approval.html' },

    // Local file links
    { from: /landing_page\.htm/g, to: 'landing_page.html' },
    { from: /mm_datasteward\.htm/g, to: 'mm_datasteward.html' },
    { from: /mm_approval\.htm/g, to: 'mm_approval.html' },
    { from: /mm_request_material\.htm/g, to: 'mm_request_material.html' },
    { from: /bp_create_vendor\.htm/g, to: 'bp_create_vendor.html' },
    { from: /bp_create_customer\.htm/g, to: 'bp_create_customer.html' },
    { from: /bp_banksteward\.htm/g, to: 'bp_banksteward.html' },
    { from: /bp_approval\.htm/g, to: 'bp_approval.html' },
    { from: /ir_create_request\.htm/g, to: 'ir_create_request.html' },
    { from: /ir_approval\.htm/g, to: 'ir_approval.html' },
    { from: /part_request\.htm/g, to: 'part_request.html' },
    { from: /part_approval\.htm/g, to: 'part_approval.html' },
    { from: /history_approved\.htm/g, to: 'history_approved.html' },
    { from: /history_rejected\.htm/g, to: 'history_rejected.html' },
    { from: /sidebar\.htm/g, to: 'sidebar.html' },
    { from: /login\.htm/g, to: 'login.html' }
  ];

  pathReplacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  // Write .html file
  const newFileName = file.replace(/\.htm$/, '.html');
  const targetPath = path.join(mdgDir, newFileName);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`Converted: ${file} -> ${newFileName}`);

  // Delete old .htm file
  fs.unlinkSync(fullPath);
});

// 3. Create index.html in MDG pointing to landing_page.html
const indexHtmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PT Kayu Mebel Indonesia - Master Data Governance</title>
  <meta http-equiv="refresh" content="0; url=landing_page.html">
  <script>
    window.location.replace('landing_page.html');
  </script>
</head>
<body style="background:#0f172a; color:#fff; font-family:sans-serif; text-align:center; padding-top:20vh;">
  <p>Mengalihkan ke Portal Master Data Governance ERP...</p>
</body>
</html>
`;
fs.writeFileSync(path.join(mdgDir, 'index.html'), indexHtmlContent, 'utf8');
console.log('Created index.html in MDG');

// 4. Clean up any "sidebar copy.htm" or "sidebar copy.html"
const sidebarCopy = path.join(mdgDir, 'sidebar copy.html');
if (fs.existsSync(sidebarCopy)) fs.unlinkSync(sidebarCopy);

console.log('MDG conversion completed successfully!');
