/**
 * =====================================================================================
 * SAP MASTER DATA GOVERNANCE (MDG) - STANDALONE SIMULATION RUNTIME ENGINE
 * PT Kayu Mebel Indonesia - Enterprise Master Data Governance System
 * Converts SAP ABAP BSP Handlers (OnInitialization & OnInputProcessing) to Pure JS
 * =====================================================================================
 */

(function (window) {
  'use strict';

  // Base path detection
  const isLocalNext = window.location.port === '3000' || window.location.hostname === 'localhost';
  const ROOT_PATH = '/project/MDG';
  const API_ENDPOINT = '/api/mdg';

  // =====================================================================================
  // 1. DATA STORAGE & SYNC ENGINE
  // =====================================================================================
  class MDGStorage {
    constructor() {
      this.cache = {};
      this.initialized = false;
    }

    async init() {
      if (this.initialized) return;
      try {
        await Promise.all([
          this.loadFile('users'),
          this.loadFile('materials'),
          this.loadFile('business_partners'),
          this.loadFile('info_records'),
          this.loadFile('staging_material'),
          this.loadFile('staging_bp'),
          this.loadFile('staging_pir'),
          this.loadFile('staging_parts')
        ]);
        this.initialized = true;
      } catch (err) {
        console.warn('[MDG Storage] Failed loading some files from API, using fallback:', err);
      }
    }

    async loadFile(fileKey) {
      // 1. Check localStorage first for instant user modifications
      const localKey = 'mdg_db_' + fileKey;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        try {
          this.cache[fileKey] = JSON.parse(localData);
          return this.cache[fileKey];
        } catch (e) {}
      }

      // 2. Fetch from Next.js API or static data folder
      try {
        let res = await fetch(`${API_ENDPOINT}?file=${fileKey}`);
        if (!res.ok) {
          // fallback to direct static file path
          res = await fetch(`${ROOT_PATH}/data/${fileKey}.json`);
        }
        if (res.ok) {
          const json = await res.json();
          this.cache[fileKey] = json;
          localStorage.setItem(localKey, JSON.stringify(json));
          return json;
        }
      } catch (e) {
        console.warn(`[MDG Storage] Error fetching ${fileKey}:`, e);
      }
      return this.cache[fileKey] || null;
    }

    get(fileKey) {
      if (!this.cache[fileKey]) {
        const localData = localStorage.getItem('mdg_db_' + fileKey);
        if (localData) {
          try { this.cache[fileKey] = JSON.parse(localData); } catch (e) {}
        }
      }
      return this.cache[fileKey] || [];
    }

    async save(fileKey, data) {
      this.cache[fileKey] = data;
      localStorage.setItem('mdg_db_' + fileKey, JSON.stringify(data));
      // Persist to server via API if available
      try {
        await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: fileKey, data })
        });
      } catch (e) {
        console.warn(`[MDG Storage] Server sync failed for ${fileKey}, cached locally:`, e);
      }
    }
  }

  const storage = new MDGStorage();

  // =====================================================================================
  // 2. AUTHENTICATION & ROLE MANAGEMENT
  // =====================================================================================
  const MDG_AUTH = {
    SESSION_KEY: 'mdg_current_session',

    getCurrentUser() {
      const saved = localStorage.getItem(this.SESSION_KEY);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return null;
    },

    setCurrentUser(user) {
      if (user) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.SESSION_KEY);
      }
      this.renderToolbar();
    },

    async login(username, password) {
      await storage.init();
      const users = storage.get('users') || [];
      const found = users.find(u => 
        u.username.toUpperCase() === username.trim().toUpperCase() && 
        u.password === password.trim()
      );
      if (found) {
        this.setCurrentUser(found);
        return { success: true, user: found };
      }
      return { success: false, message: 'Invalid Username or Password (SAP Logon Failed)' };
    },

    logout() {
      this.setCurrentUser(null);
      const isSubDir = window.location.pathname.includes('/MATERIAL MASTER/') || 
                         window.location.pathname.includes('/BUSINESS PARTNER/') ||
                         window.location.pathname.includes('/Approval/') ||
                         window.location.pathname.includes('/FINANCE/') ||
                         window.location.pathname.includes('/PENJUALAN/');
      const loginUrl = isSubDir ? `${ROOT_PATH}/login.html` : 'login.html';
      window.location.href = loginUrl;
    },

    switchRole(roleName) {
      const users = storage.get('users') || [];
      const user = users.find(u => u.role === roleName || u.username === roleName);
      if (user) {
        this.setCurrentUser(user);
        window.location.reload();
      }
    },

    checkAuth() {
      const path = window.location.pathname;
      if (path.endsWith('login.html') || path.endsWith('login.html') || path.endsWith('index.html')) {
        return;
      }
      let user = this.getCurrentUser();
      if (!user) {
        // Automatically default to DANIEL (Requestor) so users don't get stuck if opening a sub-page directly
        const defaultUser = {
          username: "DANIEL",
          name: "Daniel Siahaan",
          fullName: "Daniel Siahaan, S.Kom",
          role: "requestor",
          roleLabel: "MDG Requestor (Engineering & R&D)",
          email: "daniel@kmi.co.id",
          department: "Furniture Engineering & R&D",
          plant: "1000",
          companyCode: "1000",
          avatar: "D"
        };
        this.setCurrentUser(defaultUser);
      }
    },

    renderToolbar() {
      // Floating control bar / bottom badge navbar removed per user request
      let existing = document.getElementById('mdg-standalone-control-bar');
      if (existing) existing.remove();
    }
  };

  // Sync saved theme on document initialization
  try {
    const savedTheme = localStorage.getItem('mdg_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch(e) {}

  window.toggleMdgTheme = function() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try { localStorage.setItem('mdg_theme', newTheme); } catch(e) {}
    MDG_AUTH.renderToolbar();
  };

  // =====================================================================================
  // 3. SAP ABAP BUSINESS LOGIC PROCESSOR (Simulates OnInputProcessing & OnInitialization)
  // =====================================================================================
  class MDGLogicEngine {
    constructor(storage) {
      this.storage = storage;
    }

    async handleAction(action, params) {
      await this.storage.init();
      const currentUser = MDG_AUTH.getCurrentUser() || { username: 'DANIEL', name: 'Daniel Siahaan' };
      const act = (action || '').toUpperCase();

      // ---------------------------------------------------------------------------------
      // A. MATERIAL MASTER (MM) WORKFLOW
      // ---------------------------------------------------------------------------------
      if (act === 'SEARCH_MARA') {
        const queryMatnr = (params.matnr || params.str_matnr || '').toUpperCase();
        const queryMaktx = (params.maktx || params.str_maktx || '').toUpperCase();
        const queryMtart = (params.mtart || params.str_mtart || '').toUpperCase();
        const queryMatkl = (params.matkl || params.str_matkl || '').toUpperCase();

        const matData = this.storage.get('materials');
        const list = matData.materials || matData || [];
        const filtered = list.filter(m => {
          if (queryMatnr && !m.matnr.toUpperCase().includes(queryMatnr)) return false;
          if (queryMaktx && !m.maktx.toUpperCase().includes(queryMaktx)) return false;
          if (queryMtart && m.mtart.toUpperCase() !== queryMtart) return false;
          if (queryMatkl && m.matkl.toUpperCase() !== queryMatkl) return false;
          return true;
        });
        return filtered;
      }

      if (act === 'SAVE_STAGE') {
        // Material Master or General Part request save
        let stagingList = this.storage.get('staging_material');
        if (!Array.isArray(stagingList)) stagingList = [];

        const reqNo = params.req_no || `MM-${new Date().getFullYear()}-${String(stagingList.length + 1).padStart(4, '0')}`;
        const targetStatus = params.status || '01'; // Default: Submitted to Data Steward
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];

        // Parse items
        let items = [];
        const count = parseInt(params.count || params.row_count || '1', 10);
        for (let i = 1; i <= Math.max(count, 1); i++) {
          const maktx = params[`maktx_${i}`] || params.maktx;
          if (maktx) {
            items.push({
              item_no: i,
              req_no: reqNo,
              matnr_ext: params[`matnr_ext_${i}`] || '',
              maktx: maktx,
              mtart: params[`mtart_${i}`] || params.mtart || 'ROH',
              matkl: params[`matkl_${i}`] || params.matkl || 'RAW01',
              meins: params[`meins_${i}`] || params.meins || 'PC',
              werks: params[`werks_${i}`] || params.werks || '1000',
              lgort: params[`lgort_${i}`] || params.lgort || '1001',
              bklas: params[`bklas_${i}`] || params.bklas || '3000',
              groes: params[`groes_${i}`] || params.groes || '',
              bismt: params[`bismt_${i}`] || params.bismt || '',
              losgr: Number(params[`losgr_${i}`]) || 1,
              peinh: Number(params[`peinh_${i}`]) || 1,
              stprs: Number(params[`stprs_${i}`]) || 0,
              waers: params[`waers_${i}`] || 'IDR'
            });
          }
        }

        const newReq = {
          req_no: reqNo,
          requestor: currentUser.username,
          requestor_name: currentUser.name,
          req_date: dateStr,
          req_time: timeStr,
          req_type: params.req_type || 'CREATE',
          status: targetStatus,
          status_desc: targetStatus === '00' ? 'Draft' : targetStatus === '01' ? 'Submitted / Pending Data Steward' : 'In Progress',
          remarks: params.remarks || 'Permohonan Material Baru via SAP MDG',
          rej_reason: '',
          sub_reason: '',
          approver: '',
          app_date: '',
          app_time: '',
          items: items.length > 0 ? items : [
            {
              item_no: 1,
              req_no: reqNo,
              matnr_ext: '',
              maktx: params.maktx || 'Material Baru PT Kayu Mebel',
              mtart: params.mtart || 'ROH',
              matkl: params.matkl || 'RAW01',
              meins: params.meins || 'PC',
              werks: params.werks || '1000',
              lgort: params.lgort || '1001',
              bklas: params.bklas || '3000',
              groes: params.groes || '',
              bismt: params.bismt || '',
              losgr: 1,
              peinh: 1,
              stprs: 100000,
              waers: 'IDR'
            }
          ],
          attachments: []
        };

        const existingIdx = stagingList.findIndex(r => r.req_no === reqNo);
        if (existingIdx >= 0) {
          stagingList[existingIdx] = Object.assign(stagingList[existingIdx], newReq);
        } else {
          stagingList.unshift(newReq);
        }

        await this.storage.save('staging_material', stagingList);
        return {
          status: 'SUCCESS',
          message: `Permohonan ${reqNo} berhasil disimpan ke staging (Status: ${newReq.status_desc})`,
          req_no: reqNo
        };
      }

      if (act === 'GET_HISTORY') {
        const stagingList = this.storage.get('staging_material') || [];
        return stagingList.map(r => ({
          req_no: r.req_no,
          remarks: r.remarks,
          req_date: r.req_date,
          req_time: r.req_time,
          requestor: r.requestor,
          status: r.status,
          status_desc: r.status_desc,
          rej_reason: r.rej_reason,
          sub_reason: r.sub_reason,
          approver: r.approver,
          app_date: r.app_date,
          app_time: r.app_time,
          total_row: (r.items || []).length
        }));
      }

      if (act === 'GET_PENDING_LIST') {
        const stagingList = this.storage.get('staging_material') || [];
        // Pending for Data Steward review: status '01'
        const pending = stagingList.filter(r => r.status === '01');
        return pending.map(r => ({
          req_no: r.req_no,
          requestor: r.requestor,
          requestor_name: r.requestor_name,
          req_date: r.req_date,
          req_time: r.req_time,
          remarks: r.remarks,
          total_row: (r.items || []).length,
          status: r.status,
          items: r.items
        }));
      }

      if (act === 'GET_REQUEST_DETAIL' || act === 'GET_UPLOAD_DETAIL') {
        const reqNo = params.req_no || params.upload_id;
        const stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found) {
          return {
            hdr: found,
            dtl: found.items || [],
            att: found.attachments || []
          };
        }
        return { hdr: null, dtl: [], att: [] };
      }

      if (act === 'SAVE_MATERIAL_CODES') {
        const reqNo = params.req_no;
        let stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found && found.items) {
          const count = parseInt(params.count || '1', 10);
          for (let i = 1; i <= count; i++) {
            const ext = params[`matnr_ext_${i}`];
            if (ext && found.items[i - 1]) {
              found.items[i - 1].matnr_ext = ext.trim().toUpperCase();
            }
          }
          await this.storage.save('staging_material', stagingList);
          return { status: 'SUCCESS', message: 'Material codes successfully assigned.' };
        }
        return { status: 'ERROR', message: 'Request not found' };
      }

      if (act === 'SUBMIT_TO_APPROVAL' || act === 'CHECK_AND_FORWARD') {
        const reqNo = params.req_no;
        let stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found) {
          found.status = '02'; // Checked by Data Steward -> Pending Approver
          found.status_desc = 'Checked / Pending Approval';
          found.approver = currentUser.username;
          found.app_date = new Date().toISOString().split('T')[0];
          found.app_time = new Date().toTimeString().split(' ')[0];
          await this.storage.save('staging_material', stagingList);
          return { status: 'SUCCESS', message: `Request ${reqNo} verified and submitted to Approver.` };
        }
        return { status: 'ERROR', message: 'Request not found' };
      }

      if (act === 'RETURN_TO_REQUESTOR' || act === 'REJECT') {
        const reqNo = params.req_no;
        const reason = params.reason || params.rej_reason || 'Data tidak memenuhi kriteria standarisasi SAP.';
        let stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found) {
          found.status = '04'; // Rejected
          found.status_desc = 'Rejected';
          found.rej_reason = reason;
          found.approver = currentUser.username;
          found.app_date = new Date().toISOString().split('T')[0];
          found.app_time = new Date().toTimeString().split(' ')[0];
          await this.storage.save('staging_material', stagingList);
          return { status: 'SUCCESS', message: `Request ${reqNo} rejected.` };
        }
        return { status: 'ERROR', message: 'Request not found' };
      }

      if (act === 'GET_STAGING_LIST') {
        const stagingList = this.storage.get('staging_material') || [];
        // Pending Approver: status '02'
        const forApprover = stagingList.filter(r => r.status === '02');
        return forApprover.map(r => ({
          req_no: r.req_no,
          requestor: r.requestor,
          requestor_name: r.requestor_name,
          req_date: r.req_date,
          remarks: r.remarks,
          total_row: (r.items || []).length,
          status: r.status,
          items: r.items
        }));
      }

      if (act === 'QUICK_APPROVE' || act === 'BULK_APPROVE') {
        const reqNo = params.req_no;
        let stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found) {
          found.status = '03'; // Approved / Posted
          found.status_desc = 'Approved / Posted to SAP';
          found.approver = currentUser.username;
          found.app_date = new Date().toISOString().split('T')[0];
          found.app_time = new Date().toTimeString().split(' ')[0];

          // Post into master materials
          let matData = this.storage.get('materials');
          let matList = matData.materials || matData || [];
          (found.items || []).forEach(it => {
            const nextMatnr = it.matnr_ext || `1000${String(matList.length + 1).padStart(4, '0')}`;
            matList.push({
              matnr: nextMatnr,
              maktx: it.maktx,
              mtart: it.mtart,
              matkl: it.matkl,
              matkl_desc: 'Standard Material Group',
              meins: it.meins,
              bismt: it.bismt || nextMatnr,
              groes: it.groes || '',
              spart: '01',
              werks: it.werks,
              werks_name: it.werks === '1000' ? 'Plant Cikarang Main Factory' : 'Plant Semarang',
              lgort: it.lgort,
              lgort_name: 'Standard Storage',
              bklas: it.bklas,
              bklas_desc: 'Valuation Class',
              peinh: it.peinh || 1,
              stprs: it.stprs || 0,
              status: 'ACTIVE'
            });
          });
          matData.materials = matList;
          await this.storage.save('materials', matData);
          await this.storage.save('staging_material', stagingList);
          return { status: 'SUCCESS', message: `Request ${reqNo} successfully approved and posted to SAP Master Data!` };
        }
        return { status: 'ERROR', message: 'Request not found' };
      }

      if (act === 'BULK_REJECT' || act === 'QUICK_REJECT') {
        const reqNo = params.req_no;
        const reason = params.reason || params.rej_reason || 'Rejected by Approver';
        let stagingList = this.storage.get('staging_material') || [];
        const found = stagingList.find(r => r.req_no === reqNo);
        if (found) {
          found.status = '04';
          found.status_desc = 'Rejected';
          found.rej_reason = reason;
          found.approver = currentUser.username;
          found.app_date = new Date().toISOString().split('T')[0];
          found.app_time = new Date().toTimeString().split(' ')[0];
          await this.storage.save('staging_material', stagingList);
          return { status: 'SUCCESS', message: `Request ${reqNo} rejected.` };
        }
        return { status: 'ERROR', message: 'Request not found' };
      }

      if (act === 'GET_APPROVED_LIST') {
        const stagingList = this.storage.get('staging_material') || [];
        return stagingList.filter(r => r.status === '03');
      }

      if (act === 'GET_REJECTED_LIST') {
        const stagingList = this.storage.get('staging_material') || [];
        return stagingList.filter(r => r.status === '04');
      }

      if (act === 'GET_COUNTERS') {
        const stagingMM = this.storage.get('staging_material') || [];
        const stagingBP = this.storage.get('staging_bp') || [];
        const stagingPIR = this.storage.get('staging_pir') || [];

        return {
          status: 'SUCCESS',
          pending_count: stagingMM.filter(r => r.status === '01' || r.status === '02').length,
          checked_count: stagingMM.filter(r => r.status === '02').length,
          approved_count: stagingMM.filter(r => r.status === '03').length,
          rejected_count: stagingMM.filter(r => r.status === '04').length,
          bp_pending: stagingBP.filter(r => r.status === 'SUBMITTED' || r.status === 'CHECKED').length,
          bp_approved: stagingBP.filter(r => r.status === 'APPROVED').length,
          pir_pending: stagingPIR.filter(r => r.status === '01').length
        };
      }

      // ---------------------------------------------------------------------------------
      // B. BUSINESS PARTNER (BP) WORKFLOW
      // ---------------------------------------------------------------------------------
      if (act === 'SEARCH_BANKS' || act === 'FIND_BANK') {
        const bpData = this.storage.get('business_partners');
        const banks = (bpData && bpData.banks) ? bpData.banks : [];
        const queryBank = (params.bankl || params.banks || params.banka || '').toUpperCase();
        const res = banks.filter(b => {
          if (!queryBank) return true;
          return (b.bankl && b.bankl.includes(queryBank)) ||
                 (b.banka && b.banka.toUpperCase().includes(queryBank)) ||
                 (b.swift && b.swift.toUpperCase().includes(queryBank));
        });
        return {
          status: 'SUCCESS',
          count: res.length,
          data: res
        };
      }

      if (act === 'SEARCH_VENDOR') {
        const bpData = this.storage.get('business_partners');
        const vendors = (bpData && bpData.vendors) ? bpData.vendors : [];
        const q = (params.search || params.lifnr || params.name1 || '').toUpperCase();
        return vendors.filter(v => {
          if (!q) return true;
          return v.lifnr.includes(q) || v.name1.toUpperCase().includes(q);
        });
      }

      if (act === 'GET_BP_DETAIL') {
        const reqId = params.req_id || params.target_req_id;
        const bpList = this.storage.get('staging_bp') || [];
        const found = bpList.find(b => b.req_id === reqId);
        return found || null;
      }

      if (act === 'MARK_AS_CHECKED' || act === 'APPROVE_BANK') {
        const reqId = params.req_id;
        let bpList = this.storage.get('staging_bp') || [];
        const found = bpList.find(b => b.req_id === reqId);
        if (found) {
          if (currentUser.role === 'banksteward') {
            found.stw_bank_status = 'VERIFIED';
            found.stw_bank_note = params.note || 'Bank details and account holder verified.';
          } else {
            found.stw_data_status = 'VERIFIED';
            found.stw_data_note = params.note || 'Company address, tax identification verified.';
          }
          if (found.stw_bank_status === 'VERIFIED' && found.stw_data_status === 'VERIFIED') {
            found.status = 'CHECKED'; // Ready for Approver
          }
          await this.storage.save('staging_bp', bpList);
          return { status: 'SUCCESS', message: `Business Partner ${reqId} verified successfully.` };
        }
        return { status: 'ERROR', message: 'BP request not found' };
      }

      // ---------------------------------------------------------------------------------
      // C. PURCHASING INFO RECORD (PIR) WORKFLOW
      // ---------------------------------------------------------------------------------
      if (act === 'SEARCH_MATERIAL') {
        const matData = this.storage.get('materials');
        const list = matData.materials || matData || [];
        const q = (params.matnr || params.maktx || params.q || '').toUpperCase();
        return list.filter(m => !q || m.matnr.includes(q) || m.maktx.toUpperCase().includes(q));
      }

      if (act === 'SEARCH_PLANT') {
        const matData = this.storage.get('materials');
        return (matData.config && matData.config.plants) ? matData.config.plants : [
          { werks: '1000', name: 'Plant Cikarang Main Factory' },
          { werks: '2000', name: 'Plant Semarang Export Division' }
        ];
      }

      // ---------------------------------------------------------------------------------
      // D. LOGOUT
      // ---------------------------------------------------------------------------------
      if (act === 'LOGOUT') {
        MDG_AUTH.logout();
        return { status: 'SUCCESS', message: 'Logged out successfully' };
      }

      // Default response
      return { status: 'SUCCESS', action: act, message: `Action ${act} processed in standalone environment.` };
    }
  }

  const engine = new MDGLogicEngine(storage);

  // =====================================================================================
  // 4. FETCH INTERCEPTOR (Hijacks ?OnInputProcessing and ?action=...)
  // =====================================================================================
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    const urlStr = typeof url === 'string' ? url : url.url || '';

    // Check if this is an OnInputProcessing or action request
    const isMdgAction = urlStr.includes('OnInputProcessing') || 
                        urlStr.includes('action=') || 
                        urlStr.includes('oninputprocessing') ||
                        (options.body && typeof options.body === 'string' && options.body.includes('action='));

    if (isMdgAction) {
      try {
        let action = '';
        let params = {};

        // 1. Extract from URL parameters
        try {
          const parsedUrl = new URL(urlStr, window.location.origin);
          action = parsedUrl.searchParams.get('OnInputProcessing') || 
                   parsedUrl.searchParams.get('action') || 
                   parsedUrl.searchParams.get('onInputProcessing') || '';
          parsedUrl.searchParams.forEach((v, k) => { params[k] = v; });
        } catch (e) {
          // relative URL fallback
          const qIndex = urlStr.indexOf('?');
          if (qIndex >= 0) {
            const query = urlStr.substring(qIndex + 1);
            const pairs = query.split('&');
            pairs.forEach(p => {
              const [k, v] = p.split('=');
              if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
            });
            action = params.OnInputProcessing || params.action || params.onInputProcessing || '';
          }
        }

        // 2. Extract from POST body (FormData, URLSearchParams, or JSON)
        if (options.body) {
          if (options.body instanceof FormData) {
            for (let [k, v] of options.body.entries()) {
              params[k] = v;
              if (k.toLowerCase() === 'oninputprocessing' || k.toLowerCase() === 'action') {
                action = v;
              }
            }
          } else if (typeof options.body === 'string') {
            try {
              const jsonBody = JSON.parse(options.body);
              Object.assign(params, jsonBody);
              action = jsonBody.action || jsonBody.OnInputProcessing || action;
            } catch (e) {
              const pairs = options.body.split('&');
              pairs.forEach(p => {
                const [k, v] = p.split('=');
                if (k) {
                  const key = decodeURIComponent(k);
                  const val = decodeURIComponent(v || '');
                  params[key] = val;
                  if (key.toLowerCase() === 'action' || key.toLowerCase() === 'oninputprocessing') {
                    action = val;
                  }
                }
              });
            }
          }
        }

        // Execute action in JavaScript simulation engine
        const result = await engine.handleAction(action, params);
        const resultStr = typeof result === 'string' ? result : JSON.stringify(result);

        return new Response(resultStr, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'X-MDG-Standalone-Engine': 'Active'
          }
        });
      } catch (err) {
        console.error('[MDG Fetch Interceptor Error]', err);
        return new Response(JSON.stringify({ status: 'ERROR', message: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Call standard fetch for everything else
    return originalFetch.apply(this, arguments);
  };

  // =====================================================================================
  // 5. GLOBAL PAGE ENHANCER & SAP LINK REWRITER
  // =====================================================================================
  function fixSapLinksAndPlaceholders() {
    // 1. Rewrite obsolete SAP host links
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes('kmiprd.kmi.com:8001')) {
        if (href.includes('mm_request_material.html')) a.setAttribute('href', `${ROOT_PATH}/MATERIAL MASTER/Request Material/mm_request_material.html`);
        else if (href.includes('mm_datasteward.html')) a.setAttribute('href', `${ROOT_PATH}/MATERIAL MASTER/datasteward/mm_datasteward.html`);
        else if (href.includes('mm_approval.html')) a.setAttribute('href', `${ROOT_PATH}/Approval/mm_approval/mm_approval.html`);
        else if (href.includes('bp_create_customer.html')) a.setAttribute('href', `${ROOT_PATH}/BUSINESS PARTNER/bp_create_customer/bp_create_customer.html`);
        else if (href.includes('bp_create_vendor.html')) a.setAttribute('href', `${ROOT_PATH}/BUSINESS PARTNER/bp_create_vendor/bp_create_vendor.html`);
        else if (href.includes('test_bp_banksteward.html') || href.includes('bp_banksteward.html')) a.setAttribute('href', `${ROOT_PATH}/BUSINESS PARTNER/bp_banksteward/bp_banksteward.html`);
        else if (href.includes('bp_approval.html')) a.setAttribute('href', `${ROOT_PATH}/Approval/bp_approval/bp_approval.html`);
        else if (href.includes('ir_create_request.html')) a.setAttribute('href', `${ROOT_PATH}/FINANCE/ir_create_request.html`);
        else if (href.includes('ir_approval.html')) a.setAttribute('href', `${ROOT_PATH}/Approval/ir_approval/ir_approval.html`);
        else if (href.includes('part_request.html')) a.setAttribute('href', `${ROOT_PATH}/PENJUALAN/part_request/part_request.html`);
        else if (href.includes('part_approval.html')) a.setAttribute('href', `${ROOT_PATH}/PENJUALAN/Approval/part_approval.html`);
        else if (href.includes('test_ai.html')) a.setAttribute('href', `${ROOT_PATH}/Testing ai/test_ai.html`);
      }
    });

    // 2. Intercept Logout buttons
    document.querySelectorAll('a[href*="LOGOUT"], a[href*="logout"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        MDG_AUTH.logout();
      });
    });

    // 3. Clean up unparsed JSP/BSP placeholders in text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    const currentUser = MDG_AUTH.getCurrentUser();
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.includes('<%=')) {
        if (node.nodeValue.includes('lv_user_display')) {
          node.nodeValue = node.nodeValue.replace(/<%=.*lv_user_display.*%>/g, currentUser ? currentUser.name : 'Daniel Siahaan');
        } else if (node.nodeValue.includes('sy-uname')) {
          node.nodeValue = node.nodeValue.replace(/<%=.*sy-uname.*%>/g, currentUser ? currentUser.username : 'DANIEL');
        } else {
          node.nodeValue = node.nodeValue.replace(/<%=.*?%>/g, '');
        }
      }
    }
  }

  // Auto-init on page load
  window.MDG = {
    auth: MDG_AUTH,
    storage,
    engine,
    init: async () => {
      MDG_AUTH.checkAuth();
      await storage.init();
      MDG_AUTH.renderToolbar();
      fixSapLinksAndPlaceholders();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.MDG.init();
    });
  } else {
    window.MDG.init();
  }

})(window);
