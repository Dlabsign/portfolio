const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../public/project/MASTER DATA GOVERNANCE/MATERIAL MASTER/landing/landing_page.htm');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add CSS before </style>
const cssToInsert = `
        /* CASE STUDY NAV & MODAL STYLES */
        .mdg-case-study-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f4;
          padding: 4px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .cs-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #475569;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .cs-nav-btn:hover {
          color: #0f172a;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .cs-nav-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #334155;
          font-size: 10px;
          font-weight: 700;
        }

        .cs-nav-btn:hover .cs-nav-badge {
          background: #10b981;
          color: #ffffff;
        }

        /* CASE STUDY MODAL */
        .cs-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .cs-modal-backdrop.active {
          display: flex;
          opacity: 1;
        }

        .cs-modal-card {
          width: 100%;
          max-width: 880px;
          max-height: 88vh;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.25);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: csModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes csModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .cs-modal-header {
          padding: 24px 32px;
          border-bottom: 1px solid #edf2f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8faf9;
        }

        .cs-modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .cs-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #047857);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .cs-modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .cs-modal-subtitle {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-top: 2px;
        }

        .cs-modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cs-modal-close-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .cs-tabs-bar {
          display: flex;
          gap: 8px;
          padding: 12px 32px;
          background: #ffffff;
          border-bottom: 1px solid #edf2f0;
          overflow-x: auto;
        }

        .cs-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background: #f8faf9;
          color: #64748b;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .cs-tab-btn:hover {
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .cs-tab-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .cs-modal-body-scroll {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .cs-tab-content {
          display: none;
        }

        .cs-tab-content.active {
          display: block;
        }

        .cs-section-badge {
          display: inline-block;
          padding: 4px 10px;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }

        .cs-section-heading {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }

        .cs-section-lead {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .cs-points-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .cs-point-card {
          padding: 20px;
          border-radius: 16px;
          background: #f8faf9;
          border: 1px solid #e2e8f0;
          transition: border-color 0.2s ease;
        }

        .cs-point-card:hover {
          border-color: #10b981;
        }

        .cs-point-num {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 6px;
        }

        .cs-point-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .cs-point-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.55;
        }

        .cs-metrics-banner {
          margin-top: 24px;
          padding: 20px 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, #064e3b, #047857);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cs-metric-item {
          text-align: center;
        }

        .cs-metric-val {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .cs-metric-lbl {
          font-size: 11px;
          font-weight: 500;
          color: #a7f3d0;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
`;

if (!content.includes('mdg-case-study-nav')) {
  content = content.replace('</style>', `${cssToInsert}\n      </style>`);
}

// 2. Add Nav Menu to Header
const navMenuHtml = `
            <!-- CASE STUDY NAV MENU (THE PROBLEM, TRUST & POSITIONING, WHAT CHANGED) -->
            <nav class="mdg-case-study-nav" aria-label="Case Study Navigation">
              <button type="button" class="cs-nav-btn" onclick="openMdgCaseStudy('problem')">
                <span class="cs-nav-badge">01</span>
                <span>The Problem</span>
              </button>
              <button type="button" class="cs-nav-btn" onclick="openMdgCaseStudy('trust')">
                <span class="cs-nav-badge">02</span>
                <span>Trust &amp; Positioning</span>
              </button>
              <button type="button" class="cs-nav-btn" onclick="openMdgCaseStudy('changed')">
                <span class="cs-nav-badge">03</span>
                <span>What Changed</span>
              </button>
            </nav>
`;

if (!content.includes('mdg-case-study-nav') && content.includes('<div class="user-profile-widget">')) {
  content = content.replace('<div class="user-profile-widget">', `${navMenuHtml}\n            <div class="user-profile-widget">`);
}

// 3. Add Executive Case Study Banner in Hero
const bannerHtml = `
          <!-- CASE STUDY EXECUTIVE OVERVIEW STRIP -->
          <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 14px 24px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; background: #10b981; color: #ffffff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;">Case Study</span>
              <span style="color: #ffffff; font-size: 13px; font-weight: 600;">Enterprise Master Data Governance Transformation — PT Kayu Mebel Indonesia</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" onclick="openMdgCaseStudy('problem')" style="padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.25); color: #ffffff; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">01 The Problem</button>
              <button type="button" onclick="openMdgCaseStudy('trust')" style="padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.25); color: #ffffff; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">02 Trust &amp; Strategy</button>
              <button type="button" onclick="openMdgCaseStudy('changed')" style="padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.25); background: rgba(0,0,0,0.25); color: #ffffff; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">03 What Changed</button>
            </div>
          </div>
`;

if (!content.includes('CASE STUDY EXECUTIVE OVERVIEW STRIP') && content.includes('<section class="analytics-grid">')) {
  content = content.replace('<section class="analytics-grid">', `${bannerHtml}\n          <section class="analytics-grid">`);
}

// 4. Add Case Study Modal & Script before </body>
const modalHtml = `
      <!-- CASE STUDY MODAL DIALOG: THE PROBLEM, TRUST & POSITIONING, WHAT CHANGED -->
      <div id="mdgCaseStudyModal" class="cs-modal-backdrop" onclick="handleCsBackdropClick(event)">
        <div class="cs-modal-card">
          <!-- Modal Header -->
          <div class="cs-modal-header">
            <div class="cs-modal-header-left">
              <div class="cs-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div>
                <h2 class="cs-modal-title">SAP Master Data Governance Case Study</h2>
                <p class="cs-modal-subtitle">PT Kayu Mebel Indonesia • Enterprise Transformation &amp; Rule-Based Workflow</p>
              </div>
            </div>
            <button type="button" class="cs-modal-close-btn" onclick="closeMdgCaseStudy()" title="Close (Esc)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Tab Switcher -->
          <div class="cs-tabs-bar">
            <button type="button" id="csTabProblemBtn" class="cs-tab-btn active" onclick="switchMdgCaseStudyTab('problem')">
              <span>01</span>
              <span>The Problem</span>
            </button>
            <button type="button" id="csTabTrustBtn" class="cs-tab-btn" onclick="switchMdgCaseStudyTab('trust')">
              <span>02</span>
              <span>Trust &amp; Positioning</span>
            </button>
            <button type="button" id="csTabChangedBtn" class="cs-tab-btn" onclick="switchMdgCaseStudyTab('changed')">
              <span>03</span>
              <span>What Changed</span>
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="cs-modal-body-scroll">
            <!-- TAB 1: THE PROBLEM -->
            <div id="csTabProblem" class="cs-tab-content active">
              <span class="cs-section-badge">Tantangan Operasional Enterprise</span>
              <h3 class="cs-section-heading">Permasalahan Master Data &amp; Fragmentasi Alur Kerja</h3>
              <p class="cs-section-lead">
                Pada ekosistem manufaktur PT Kayu Mebel Indonesia, pembuatan dan perubahan master data sebelumnya tersebar di berbagai divisi tanpa kontrol versi dan validasi terpusat.
              </p>

              <div class="cs-points-grid">
                <div class="cs-point-card">
                  <div class="cs-point-num">01.01</div>
                  <h4 class="cs-point-title">Silo Spreadsheet Tanpa Sinkronisasi</h4>
                  <p class="cs-point-desc">Departemen PPIC, Purchasing, dan Sales mengelola daftar Excel masing-masing tanpa satu sumber kebenaran (Single Source of Truth), menimbulkan perbedaan spesifikasi bahan baku.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">01.02</div>
                  <h4 class="cs-point-title">Duplikasi Nomor Material di SAP MARA</h4>
                  <p class="cs-point-desc">Ketiadaan pencarian referensi awal membuat pengguna sering membuat material baru padahal material sejenis sudah ada di database SAP, mengacaukan analisis inventaris.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">01.03</div>
                  <h4 class="cs-point-title">Rekening Bank Vendor Tidak Tervalidasi</h4>
                  <p class="cs-point-desc">Data rekening bank mitra bisnis tidak diverifikasi langsung terhadap master bank SE11/BNKA, menimbulkan risiko gagal kliring pada transaksi Finance.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">01.04</div>
                  <h4 class="cs-point-title">Persetujuan Email Lambat Tanpa Audit Trail</h4>
                  <p class="cs-point-desc">Siklus persetujuan via rantai email memakan waktu 3-5 hari kerja, sering tertimbun di kotak masuk, dan tidak memiliki rekam jejak legal yang terstruktur.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">01.05</div>
                  <h4 class="cs-point-title">Kompleksitas Perhitungan BOM Furniture</h4>
                  <p class="cs-point-desc">Konversi dimensi kayu mentah (rough size) ke part jadi (finish size) dan komponen hardware dihitung manual secara terpisah, memicu selisih stok produksi.</p>
                </div>
              </div>
            </div>

            <!-- TAB 2: TRUST & POSITIONING -->
            <div id="csTabTrust" class="cs-tab-content">
              <span class="cs-section-badge">Arsitektur &amp; Standar Enterprise</span>
              <h3 class="cs-section-heading">Pendekatan Tata Kelola Solusi &amp; Jaminan Kepercayaan</h3>
              <p class="cs-section-lead">
                Solusi dirancang dengan mengadopsi standar arsitektur resmi SAP Master Data Governance (MDG) dengan pemisahan tugas ketat dan integritas data mutlak.
              </p>

              <div class="cs-points-grid">
                <div class="cs-point-card">
                  <div class="cs-point-num">02.01</div>
                  <h4 class="cs-point-title">Rule-Based Workflow SAP MDG</h4>
                  <p class="cs-point-desc">Mengadopsi alur bertahap resmi: Pengajuan (Request) → Pemeriksaan Data Steward → Verifikasi Bank Steward → Keputusan Final Approver.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">02.02</div>
                  <h4 class="cs-point-title">Pemisahan Tugas (Segregation of Duties)</h4>
                  <p class="cs-point-desc">Setiap pengguna hanya memiliki hak akses sesuai perannya. Pengaju tidak dapat menyetujui datanya sendiri guna mencegah konflik kepentingan dan manipulasi.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">02.03</div>
                  <h4 class="cs-point-title">Tabel Staging Kustom SE11</h4>
                  <p class="cs-point-desc">Data diverifikasi terlebih dahulu di tabel staging (ZMDG_STG_HDR, ZTB_BP_REQ) sebelum direplikasi ke tabel produksi SAP inti (MARA, BUT000, EINA).</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">02.04</div>
                  <h4 class="cs-point-title">Integrasi Terpercaya Berbasis BAPI</h4>
                  <p class="cs-point-desc">Menggunakan Application Programming Interface standar SAP (BAPI_MATERIAL_SAVEDATA &amp; BAPI_ROUTING_CREATE) untuk memastikan semua validasi ERP terpenuhi.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">02.05</div>
                  <h4 class="cs-point-title">Simulasi Mandiri Berbasis JSON</h4>
                  <p class="cs-point-desc">Mekanisme runtime mandiri berbasis JSON memungkinkan validasi antarmuka, pengujian alur, dan demo interaktif di luar jaringan SAP secara mulus.</p>
                </div>
              </div>
            </div>

            <!-- TAB 3: WHAT CHANGED -->
            <div id="csTabChanged" class="cs-tab-content">
              <span class="cs-section-badge">Hasil Nyata &amp; Transformasi Operasional</span>
              <h3 class="cs-section-heading">Perubahan Efisiensi &amp; Dampak Terukur</h3>
              <p class="cs-section-lead">
                Transformasi digital ini menyatukan tata kelola master data manufaktur menjadi sistem otomatis yang akurat, transparan, dan terukur.
              </p>

              <div class="cs-points-grid">
                <div class="cs-point-card">
                  <div class="cs-point-num">03.01</div>
                  <h4 class="cs-point-title">Satu Portal Terpadu 100% Digital</h4>
                  <p class="cs-point-desc">Material Master (MDG-M), Business Partner (MDG-BP), dan Purchasing Info Record terintegrasi dalam satu portal berbasis web responsif.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">03.02</div>
                  <h4 class="cs-point-title">Otomasi Ingesti Multi-Sheet BOM</h4>
                  <p class="cs-point-desc">Parser cerdas membaca lembar kerja BOM Material dan BOM Hardware secara otomatis, memetakan ratusan part mentah dan part jadi dalam hitungan detik.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">03.03</div>
                  <h4 class="cs-point-title">Nol Duplikasi Data (Zero Duplicates)</h4>
                  <p class="cs-point-desc">Pencarian referensi dengan dukungan wildcard dan alpha conversion menjamin tidak ada material ganda yang lolos ke database SAP.</p>
                </div>
                <div class="cs-point-card">
                  <div class="cs-point-num">03.04</div>
                  <h4 class="cs-point-title">Jejak Audit Lengkap &amp; Transparan</h4>
                  <p class="cs-point-desc">Setiap aksi (Submit, Reject, Approve) disertai timestamp, identitas peninjau, dan catatan revisi yang tersimpan permanen.</p>
                </div>
              </div>

              <!-- Metrics Banner -->
              <div class="cs-metrics-banner">
                <div class="cs-metric-item">
                  <div class="cs-metric-val">&lt; 15 Mins</div>
                  <div class="cs-metric-lbl">Lead Time Approval (vs 3-5 Hari)</div>
                </div>
                <div class="cs-metric-item">
                  <div class="cs-metric-val">100%</div>
                  <div class="cs-metric-lbl">Audit Trail Digital</div>
                </div>
                <div class="cs-metric-item">
                  <div class="cs-metric-val">0</div>
                  <div class="cs-metric-lbl">Duplikasi Material MARA</div>
                </div>
                <div class="cs-metric-item">
                  <div class="cs-metric-val">3 In 1</div>
                  <div class="cs-metric-lbl">Modul Master Data Terpadu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        // CASE STUDY MODAL SCRIPTS
        function openMdgCaseStudy(tab) {
          var modal = document.getElementById('mdgCaseStudyModal');
          if (!modal) return;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          if (tab) {
            switchMdgCaseStudyTab(tab);
          }
        }

        function closeMdgCaseStudy() {
          var modal = document.getElementById('mdgCaseStudyModal');
          if (!modal) return;
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }

        function switchMdgCaseStudyTab(tab) {
          var tabs = ['problem', 'trust', 'changed'];
          tabs.forEach(function (t) {
            var btn = document.getElementById('csTab' + capitalizeFirstLetter(t) + 'Btn');
            var content = document.getElementById('csTab' + capitalizeFirstLetter(t));
            if (btn) btn.classList.remove('active');
            if (content) content.classList.remove('active');
          });

          var activeBtn = document.getElementById('csTab' + capitalizeFirstLetter(tab) + 'Btn');
          var activeContent = document.getElementById('csTab' + capitalizeFirstLetter(tab));
          if (activeBtn) activeBtn.classList.add('active');
          if (activeContent) activeContent.classList.add('active');
        }

        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function handleCsBackdropClick(e) {
          if (e.target && e.target.id === 'mdgCaseStudyModal') {
            closeMdgCaseStudy();
          }
        }

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            closeMdgCaseStudy();
          }
        });
      </script>
`;

if (!content.includes('mdgCaseStudyModal')) {
  content = content.replace('</body>', `${modalHtml}\n    </body>`);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully patched landing_page.htm with Case Study Nav and Modal!');
