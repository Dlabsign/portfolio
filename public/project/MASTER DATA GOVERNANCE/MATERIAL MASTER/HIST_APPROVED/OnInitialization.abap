*======================================================================*
* SAP BSP EVENT HANDLER: OnInitialization                              *
* Target BSP Page: history_approved.htm                                *
* Application: MDG Staging Part Approved History (ZMDG_STG_HDR & PART) *
*======================================================================*

TYPES: BEGIN OF ty_history_item,
         module_type   TYPE string,
         bp_role       TYPE string,
         bp_number     TYPE string,
         customer_no   TYPE string,
         supplier_no   TYPE string,
         customer_num  TYPE string,
         supplier_num  TYPE string,
         bp_category   TYPE string,
         name1         TYPE string,
         name2         TYPE string,
         search_term   TYPE string,
         street        TYPE string,
         house_num     TYPE string,
         city          TYPE string,
         postal_code   TYPE string,
         country       TYPE string,
         region        TYPE string,
         telephone     TYPE string,
         email         TYPE string,
         tax_num       TYPE string,
         bankl         TYPE string,
         bank_name     TYPE string,
         bankn         TYPE string,
         koinh         TYPE string,
         bukrs         TYPE string,
         akont         TYPE string,
         zterm         TYPE string,
         waers         TYPE string,
         stw_data_by   TYPE string,
         appr_final_by TYPE string,
         req_no        TYPE string,
         remarks       TYPE string,
         sub_reason    TYPE string,
         req_date      TYPE string,
         req_time      TYPE string,
         requestor     TYPE string,
         status        TYPE string,
         total_item    TYPE i,
         matnr_gen     TYPE string,
         maktx_desc    TYPE string,
         approver      TYPE string,
         app_date      TYPE string,
         app_time      TYPE string,
         rej_reason    TYPE string,
       END OF ty_history_item.

DATA: lv_action_ha     TYPE string,
      lt_history       TYPE TABLE OF ty_history_item,
      ls_item          TYPE ty_history_item,
      lt_hdr_db        TYPE TABLE OF zmdg_stg_hdr,
      ls_hdr_db        TYPE zmdg_stg_hdr,
      lt_dtl_db        TYPE TABLE OF zmdg_stg_part,
      ls_dtl_db        TYPE zmdg_stg_part,
      lt_bp_app        TYPE TABLE OF zmdg_bp_req,
      ls_bp_app        TYPE zmdg_bp_req,
      lv_codes_str     TYPE string,
      lv_maktx_str     TYPE string,
      lv_clean_mat     TYPE string,
      lv_json_res      TYPE string,
      lv_req_no_ha     TYPE string,
      lv_cnt_p         TYPE i,
      lv_cnt_a         TYPE i,
      lv_cnt_r         TYPE i,
      lv_cnt_draft     TYPE i,
      lv_cnt_total     TYPE i,
      lv_auth_user     TYPE string,
      lv_persnum       TYPE usr21-persnumber,
      lv_fname         TYPE adrp-name_first,
      lv_lname         TYPE adrp-name_last,
      ls_bapi_addr     TYPE bapiaddr3,
      lt_bapi_ret      TYPE TABLE OF bapiret2,
      lv_uname_tmp     TYPE bapibname-bapibname,
      lv_bp_guid       TYPE bu_partner_guid,
      lv_sap_bp        TYPE bu_partner,
      lv_cvi_kunnr     TYPE kunnr,
      lv_cvi_lifnr     TYPE lifnr,
      lv_clean_bp      TYPE string,
      lv_clean_cust    TYPE string,
      lv_clean_supp    TYPE string,
      lv_req_full_name TYPE string,
      lv_req_user_key  TYPE string,
      ls_baddr_tmp     TYPE bapiaddr3,
      lt_bret_tmp      TYPE TABLE OF bapiret2,
      lv_pnum_tmp      TYPE usr21-persnumber,
      lv_fnm_tmp       TYPE adrp-name_first,
      lv_lnm_tmp       TYPE adrp-name_last,
      lv_bp_date       TYPE d,
      lv_bp_time       TYPE t.

lv_auth_user = sy-uname.
TRANSLATE lv_auth_user TO UPPER CASE.
CONDENSE lv_auth_user NO-GAPS.

IF lv_auth_user <> 'ABAPER04' AND lv_auth_user <> 'BASIS' AND
   lv_auth_user <> 'KMI-BOD' AND lv_auth_user <> 'KMI-U163' AND
   lv_auth_user <> 'ADMINISTRATOR' AND lv_auth_user <> 'TOTOK' AND lv_auth_user <> 'DEFAULT'.
  lv_action_ha = request->get_form_field( 'action' ).
  IF lv_action_ha IS INITIAL.
    lv_action_ha = request->get_form_field( 'OnInputProcessing' ).
  ENDIF.
  IF lv_action_ha IS NOT INITIAL.
    lv_json_res = '{"status":"ERROR","message":"Akses Terbatas: Anda tidak memiliki akses untuk masuk ke halaman ini."}'.
    _m_response->set_status( code = 403 reason = 'Forbidden' ).
    _m_response->set_content_type( 'application/json' ).
    _m_response->set_cdata( lv_json_res ).
    _m_navigation->response_complete( ).
    RETURN.
  ENDIF.
ENDIF.

lv_action_ha = request->get_form_field( 'action' ).
IF lv_action_ha IS INITIAL.
  lv_action_ha = request->get_form_field( 'OnInputProcessing' ).
ENDIF.
TRANSLATE lv_action_ha TO UPPER CASE.

" 1. Handler AJAX: GET_COUNTERS
IF lv_action_ha = 'GET_COUNTERS'.
  DATA: lv_cnt_mat_p TYPE i,
        lv_cnt_bp_p  TYPE i,
        lv_cnt_ir_p  TYPE i,
        lv_cnt_bp_a  TYPE i,
        lv_cnt_ir_a  TYPE i,
        lv_cnt_bp_r  TYPE i,
        lv_cnt_ir_r  TYPE i.

  SELECT COUNT( * ) FROM zmdg_req_hdr
    WHERE status IN ( 'CHECKED', 'CODED' )
    INTO @lv_cnt_mat_p.

  SELECT COUNT( * ) FROM zmdg_bp_req
    WHERE status IN ( 'SUBMITTED', 'CHECKED' )
    INTO @lv_cnt_bp_p.

  SELECT COUNT( * ) FROM zmdg_req_pir
    WHERE status = '01'
    INTO @lv_cnt_ir_p.

  lv_cnt_p = lv_cnt_mat_p + lv_cnt_bp_p + lv_cnt_ir_p.

  SELECT COUNT( * ) FROM zmdg_req_hdr
    WHERE status = 'APPROVED'
    INTO @lv_cnt_a.

  SELECT COUNT( * ) FROM zmdg_bp_req
    WHERE status IN ( 'APPROVED', 'SD_APPROVED', 'MM_APPROVED' )
    INTO @lv_cnt_bp_a.

  SELECT COUNT( * ) FROM zmdg_req_pir
    WHERE status IN ( '02', '04' )
    INTO @lv_cnt_ir_a.

  lv_cnt_a = lv_cnt_a + lv_cnt_bp_a + lv_cnt_ir_a.

  SELECT COUNT( * ) FROM zmdg_req_hdr
    WHERE status IN ( 'REJECTED', 'FAILED' )
    INTO @lv_cnt_r.

  SELECT COUNT( * ) FROM zmdg_bp_req
    WHERE status IN ( 'REJECTED', 'FAILED' )
    INTO @lv_cnt_bp_r.

  SELECT COUNT( * ) FROM zmdg_req_pir
    WHERE status IN ( '03', '05' )
    INTO @lv_cnt_ir_r.

  lv_cnt_r = lv_cnt_r + lv_cnt_bp_r + lv_cnt_ir_r.

  lv_cnt_total = lv_cnt_a + lv_cnt_r.

  lv_json_res = '{"pending":' && lv_cnt_p &&
                ',"mat_pending":' && lv_cnt_mat_p &&
                ',"bp_pending":' && lv_cnt_bp_p &&
                ',"ir_pending":' && lv_cnt_ir_p &&
                ',"approved":' && lv_cnt_a &&
                ',"rejected":' && lv_cnt_r &&
                ',"total_history":' && lv_cnt_total && '}'.

  _m_response->set_content_type( 'application/json' ).
  _m_response->set_cdata( lv_json_res ).
  _m_navigation->response_complete( ).
  RETURN.
ENDIF.

" 2. Handler AJAX: GET_APPROVED_LIST / GET_HISTORY_LIST
IF lv_action_ha = 'GET_APPROVED_LIST' OR
   lv_action_ha = 'GET_HISTORY_LIST'.

  CLEAR: lt_history, lt_hdr_db.

  SELECT * FROM zmdg_stg_hdr
    INTO TABLE @lt_hdr_db
    WHERE status = 'APPROVED'
    ORDER BY req_date DESCENDING, req_time DESCENDING.

  LOOP AT lt_hdr_db INTO ls_hdr_db.
    CLEAR: ls_item, lv_codes_str, lv_maktx_str, lt_dtl_db.

    ls_item-module_type = 'MM'.
    ls_item-req_no     = CONV #( ls_hdr_db-req_no ).
    ls_item-remarks    = CONV #( ls_hdr_db-remarks ).
    ls_item-sub_reason = CONV #( ls_hdr_db-sub_reason ).
    ls_item-req_date   = CONV #( ls_hdr_db-req_date ).
    ls_item-req_time   = CONV #( ls_hdr_db-req_time ).
    ls_item-status     = CONV #( ls_hdr_db-status ).
    ls_item-app_date   = CONV #( ls_hdr_db-app_date ).
    ls_item-app_time   = CONV #( ls_hdr_db-app_time ).
    ls_item-rej_reason = CONV #( ls_hdr_db-rej_reason ).

    " Requestor Name Resolution
    IF ls_hdr_db-requestor IS NOT INITIAL.
      CLEAR: ls_bapi_addr, lt_bapi_ret, lv_fname, lv_lname.
      lv_uname_tmp = ls_hdr_db-requestor.
      CALL FUNCTION 'BAPI_USER_GET_DETAIL'
        EXPORTING
          username = lv_uname_tmp
        IMPORTING
          address  = ls_bapi_addr
        TABLES
          return   = lt_bapi_ret.

      IF ls_bapi_addr-firstname IS NOT INITIAL OR ls_bapi_addr-lastname IS NOT INITIAL.
        CONCATENATE ls_bapi_addr-firstname ls_bapi_addr-lastname INTO ls_item-requestor SEPARATED BY space.
      ELSEIF ls_bapi_addr-fullname IS NOT INITIAL.
        ls_item-requestor = ls_bapi_addr-fullname.
      ELSE.
        SELECT SINGLE persnumber FROM usr21 INTO lv_persnum WHERE bname = ls_hdr_db-requestor.
        IF sy-subrc = 0.
          SELECT SINGLE name_first name_last FROM adrp INTO (lv_fname, lv_lname) WHERE persnumber = lv_persnum.
          IF lv_fname IS NOT INITIAL OR lv_lname IS NOT INITIAL.
            CONCATENATE lv_fname lv_lname INTO ls_item-requestor SEPARATED BY space.
          ENDIF.
        ENDIF.
      ENDIF.
    ENDIF.
    IF ls_item-requestor IS INITIAL.
      ls_item-requestor = ls_hdr_db-requestor.
    ENDIF.
    CONDENSE ls_item-requestor.

    " Approver Name Resolution
    IF ls_hdr_db-approver IS NOT INITIAL.
      CLEAR: ls_bapi_addr, lt_bapi_ret, lv_fname, lv_lname.
      lv_uname_tmp = ls_hdr_db-approver.
      CALL FUNCTION 'BAPI_USER_GET_DETAIL'
        EXPORTING
          username = lv_uname_tmp
        IMPORTING
          address  = ls_bapi_addr
        TABLES
          return   = lt_bapi_ret.

      IF ls_bapi_addr-firstname IS NOT INITIAL OR ls_bapi_addr-lastname IS NOT INITIAL.
        CONCATENATE ls_bapi_addr-firstname ls_bapi_addr-lastname INTO ls_item-approver SEPARATED BY space.
      ELSEIF ls_bapi_addr-fullname IS NOT INITIAL.
        ls_item-approver = ls_bapi_addr-fullname.
      ELSE.
        SELECT SINGLE persnumber FROM usr21 INTO lv_persnum WHERE bname = ls_hdr_db-approver.
        IF sy-subrc = 0.
          SELECT SINGLE name_first name_last FROM adrp INTO (lv_fname, lv_lname) WHERE persnumber = lv_persnum.
          IF lv_fname IS NOT INITIAL OR lv_lname IS NOT INITIAL.
            CONCATENATE lv_fname lv_lname INTO ls_item-approver SEPARATED BY space.
          ENDIF.
        ENDIF.
      ENDIF.
    ENDIF.
    IF ls_item-approver IS INITIAL.
      ls_item-approver = ls_hdr_db-approver.
    ENDIF.
    CONDENSE ls_item-approver.

    SELECT COUNT( * ) FROM zmdg_stg_part
      WHERE req_no = @ls_hdr_db-req_no INTO @ls_item-total_item.

    SELECT * FROM zmdg_stg_part
      WHERE req_no = @ls_hdr_db-req_no INTO TABLE @lt_dtl_db.

    LOOP AT lt_dtl_db INTO ls_dtl_db.
      IF ls_dtl_db-maktx IS NOT INITIAL.
        IF lv_maktx_str IS INITIAL.
          lv_maktx_str = ls_dtl_db-maktx.
        ELSE.
          lv_maktx_str = lv_maktx_str && ', ' && ls_dtl_db-maktx.
        ENDIF.
      ENDIF.

      IF ls_dtl_db-matnr_ext IS NOT INITIAL.
        lv_clean_mat = ls_dtl_db-matnr_ext.
        SHIFT lv_clean_mat LEFT DELETING LEADING '0'.
        IF lv_clean_mat IS INITIAL.
          lv_clean_mat = '0'.
        ENDIF.
        IF lv_codes_str IS INITIAL.
          lv_codes_str = lv_clean_mat.
        ELSE.
          lv_codes_str = lv_codes_str && ', ' && lv_clean_mat.
        ENDIF.
      ELSEIF ls_dtl_db-ferth IS NOT INITIAL.
        IF lv_codes_str IS INITIAL.
          lv_codes_str = ls_dtl_db-ferth.
        ELSE.
          lv_codes_str = lv_codes_str && ', ' && ls_dtl_db-ferth.
        ENDIF.
      ENDIF.
    ENDLOOP.

    ls_item-matnr_gen  = lv_codes_str.
    ls_item-maktx_desc = lv_maktx_str.

    APPEND ls_item TO lt_history.
  ENDLOOP.

  " Tambahkan data Business Partner yang sudah approved (MM_APPROVED dan APPROVED)
  SELECT * FROM zmdg_bp_req
    INTO TABLE @lt_bp_app
    WHERE status IN ( 'MM_APPROVED', 'APPROVED', 'SD_APPROVED' )
    ORDER BY req_id DESCENDING.

  LOOP AT lt_bp_app INTO ls_bp_app.
    CLEAR: ls_item, lv_req_full_name, ls_baddr_tmp,
           lt_bret_tmp, lv_pnum_tmp, lv_fnm_tmp, lv_lnm_tmp,
           lv_bp_guid, lv_sap_bp, lv_cvi_kunnr, lv_cvi_lifnr,
           lv_clean_bp, lv_clean_cust, lv_clean_supp.

    IF ls_bp_app-bp_role CS 'CU' OR ls_bp_app-bu_group CP 'C*'.
      ls_item-module_type = 'CUSTOMER'.
    ELSE.
      ls_item-module_type = 'VENDOR'.
    ENDIF.

    ls_item-bp_role       = CONV #( ls_bp_app-bp_role ).
    ls_item-bp_category   = CONV #( ls_bp_app-bp_category ).
    ls_item-req_no        = CONV #( ls_bp_app-req_id ).
    ls_item-remarks       = CONV #( ls_bp_app-name1 ).
    ls_item-sub_reason    = |BP: { ls_bp_app-name1 } ({ ls_bp_app-search_term })|.
    ls_item-name1         = CONV #( ls_bp_app-name1 ).
    ls_item-name2         = CONV #( ls_bp_app-name2 ).
    ls_item-search_term   = CONV #( ls_bp_app-search_term ).
    ls_item-street        = CONV #( ls_bp_app-street ).
    ls_item-house_num     = CONV #( ls_bp_app-house_num ).
    ls_item-city          = CONV #( ls_bp_app-city ).
    ls_item-postal_code   = CONV #( ls_bp_app-postal_code ).
    ls_item-country       = CONV #( ls_bp_app-country ).
    ls_item-region        = CONV #( ls_bp_app-region ).
    ls_item-telephone     = CONV #( ls_bp_app-telephone ).
    ls_item-email         = CONV #( ls_bp_app-email ).
    ls_item-tax_num       = CONV #( ls_bp_app-tax_num ).
    ls_item-bankl         = CONV #( ls_bp_app-bankl ).
    ls_item-bank_name     = CONV #( ls_bp_app-bank_name ).
    ls_item-bankn         = CONV #( ls_bp_app-bankn ).
    ls_item-koinh         = CONV #( ls_bp_app-koinh ).
    ls_item-bukrs         = CONV #( ls_bp_app-bukrs ).
    ls_item-akont         = CONV #( ls_bp_app-akont ).
    ls_item-zterm         = CONV #( ls_bp_app-zterm ).
    ls_item-waers         = CONV #( ls_bp_app-waers ).
    ls_item-stw_data_by   = CONV #( ls_bp_app-stw_data_by ).
    ls_item-appr_final_by = CONV #( ls_bp_app-appr_final_by ).

    IF ls_bp_app-created_at IS NOT INITIAL.
      CONVERT TIME STAMP ls_bp_app-created_at TIME ZONE sy-zonlo
        INTO DATE lv_bp_date TIME lv_bp_time.
      ls_item-req_date = lv_bp_date.
      ls_item-req_time = lv_bp_time.
    ELSE.
      ls_item-req_date = sy-datum.
      ls_item-req_time = sy-uzeit.
    ENDIF.

    IF ls_bp_app-appr_final_at IS NOT INITIAL.
      CONVERT TIME STAMP ls_bp_app-appr_final_at TIME ZONE sy-zonlo
        INTO DATE lv_bp_date TIME lv_bp_time.
      ls_item-app_date = lv_bp_date.
      ls_item-app_time = lv_bp_time.
    ELSEIF ls_bp_app-changed_at IS NOT INITIAL.
      CONVERT TIME STAMP ls_bp_app-changed_at TIME ZONE sy-zonlo
        INTO DATE lv_bp_date TIME lv_bp_time.
      ls_item-app_date = lv_bp_date.
      ls_item-app_time = lv_bp_time.
    ENDIF.

    ls_item-status        = CONV #( ls_bp_app-status ).
    ls_item-total_item    = 1.

    " Resolusi Nama Lengkap Requestor (Firstname + Lastname)
    lv_req_user_key = ls_bp_app-created_by.
    IF lv_req_user_key IS INITIAL.
      lv_req_user_key = ls_bp_app-changed_by.
    ENDIF.
    TRANSLATE lv_req_user_key TO UPPER CASE.
    CONDENSE lv_req_user_key NO-GAPS.
    IF lv_req_user_key IS NOT INITIAL.
      CALL FUNCTION 'BAPI_USER_GET_DETAIL'
        EXPORTING username = CONV sy-uname( lv_req_user_key )
        IMPORTING address  = ls_baddr_tmp
        TABLES    return   = lt_bret_tmp.
      IF ls_baddr_tmp-firstname IS NOT INITIAL OR
         ls_baddr_tmp-lastname IS NOT INITIAL.
        CONCATENATE ls_baddr_tmp-firstname ls_baddr_tmp-lastname INTO
          lv_req_full_name SEPARATED BY space.
      ELSEIF ls_baddr_tmp-fullname IS NOT INITIAL.
        lv_req_full_name = ls_baddr_tmp-fullname.
      ELSE.
        SELECT SINGLE persnumber FROM usr21 INTO lv_pnum_tmp
          WHERE bname = lv_req_user_key.
        IF sy-subrc = 0.
          SELECT SINGLE name_first name_last FROM adrp INTO
            (lv_fnm_tmp, lv_lnm_tmp) WHERE persnumber = lv_pnum_tmp.
          IF lv_fnm_tmp IS NOT INITIAL OR lv_lnm_tmp IS NOT INITIAL.
            CONCATENATE lv_fnm_tmp lv_lnm_tmp INTO lv_req_full_name
              SEPARATED BY space.
          ENDIF.
        ENDIF.
      ENDIF.
    ENDIF.
    IF lv_req_full_name IS INITIAL.
      IF lv_req_user_key IS NOT INITIAL.
        lv_req_full_name = lv_req_user_key.
      ELSE.
        lv_req_full_name = 'User tidak ditemukan'.
      ENDIF.
    ENDIF.
    CONDENSE lv_req_full_name.
    ls_item-requestor = lv_req_full_name.

    " Resolusi Nama Approver
    IF ls_bp_app-appr_final_by IS NOT INITIAL.
      CLEAR: ls_baddr_tmp, lt_bret_tmp, lv_pnum_tmp, lv_fnm_tmp, lv_lnm_tmp, lv_req_full_name.
      lv_req_user_key = ls_bp_app-appr_final_by.
      TRANSLATE lv_req_user_key TO UPPER CASE.
      CONDENSE lv_req_user_key NO-GAPS.
      CALL FUNCTION 'BAPI_USER_GET_DETAIL'
        EXPORTING username = CONV sy-uname( lv_req_user_key )
        IMPORTING address  = ls_baddr_tmp
        TABLES    return   = lt_bret_tmp.
      IF ls_baddr_tmp-firstname IS NOT INITIAL OR
         ls_baddr_tmp-lastname IS NOT INITIAL.
        CONCATENATE ls_baddr_tmp-firstname ls_baddr_tmp-lastname INTO
          ls_item-approver SEPARATED BY space.
      ELSEIF ls_baddr_tmp-fullname IS NOT INITIAL.
        ls_item-approver = ls_baddr_tmp-fullname.
      ELSE.
        SELECT SINGLE persnumber FROM usr21 INTO lv_pnum_tmp
          WHERE bname = lv_req_user_key.
        IF sy-subrc = 0.
          SELECT SINGLE name_first name_last FROM adrp INTO
            (lv_fnm_tmp, lv_lnm_tmp) WHERE persnumber = lv_pnum_tmp.
          IF lv_fnm_tmp IS NOT INITIAL OR lv_lnm_tmp IS NOT INITIAL.
            CONCATENATE lv_fnm_tmp lv_lnm_tmp INTO ls_item-approver
              SEPARATED BY space.
          ENDIF.
        ENDIF.
      ENDIF.
    ENDIF.
    IF ls_item-approver IS INITIAL.
      ls_item-approver = ls_bp_app-appr_final_by.
    ENDIF.
    CONDENSE ls_item-approver.

    " Ambil Nomor Aktual SAP BP, Customer, dan Supplier dari SAP
    IF ls_bp_app-bp_number IS NOT INITIAL.
      lv_clean_bp = ls_bp_app-bp_number.
      SHIFT lv_clean_bp LEFT DELETING LEADING '0'.
      IF lv_clean_bp IS INITIAL.
        lv_clean_bp = ls_bp_app-bp_number.
      ENDIF.
      ls_item-bp_number = lv_clean_bp.
      ls_item-matnr_gen = lv_clean_bp.

      lv_sap_bp = ls_bp_app-bp_number.
      CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
        EXPORTING input  = lv_sap_bp
        IMPORTING output = lv_sap_bp.

      SELECT SINGLE partner_guid FROM but000 INTO @lv_bp_guid
        WHERE partner = @lv_sap_bp.
      IF sy-subrc <> 0.
        SELECT SINGLE partner_guid FROM but000 INTO @lv_bp_guid
          WHERE partner = @ls_bp_app-bp_number.
      ENDIF.

      IF ls_item-module_type = 'CUSTOMER' OR ls_bp_app-bp_role CS 'CU' OR ls_bp_app-bp_role CS 'CRM'.
        IF lv_bp_guid IS NOT INITIAL.
          SELECT SINGLE customer FROM cvi_cust_link INTO @lv_cvi_kunnr
            WHERE partner_guid = @lv_bp_guid.
        ENDIF.
        IF lv_cvi_kunnr IS INITIAL.
          SELECT SINGLE kunnr FROM kna1 INTO @lv_cvi_kunnr
            WHERE kunnr = @lv_sap_bp.
        ENDIF.
        IF lv_cvi_kunnr IS NOT INITIAL.
          lv_clean_cust = lv_cvi_kunnr.
          SHIFT lv_clean_cust LEFT DELETING LEADING '0'.
          IF lv_clean_cust IS INITIAL.
            lv_clean_cust = '0'.
          ENDIF.
          ls_item-customer_no  = lv_clean_cust.
          ls_item-customer_num = lv_clean_cust.
        ENDIF.
      ENDIF.

      IF ls_item-module_type = 'VENDOR' OR ls_bp_app-bp_role CS 'VN' OR ls_bp_app-bp_role CS 'VE'.
        IF lv_bp_guid IS NOT INITIAL.
          SELECT SINGLE vendor FROM cvi_vend_link INTO @lv_cvi_lifnr
            WHERE partner_guid = @lv_bp_guid.
        ENDIF.
        IF lv_cvi_lifnr IS INITIAL.
          SELECT SINGLE lifnr FROM lfa1 INTO @lv_cvi_lifnr
            WHERE lifnr = @lv_sap_bp.
        ENDIF.
        IF lv_cvi_lifnr IS NOT INITIAL.
          lv_clean_supp = lv_cvi_lifnr.
          SHIFT lv_clean_supp LEFT DELETING LEADING '0'.
          IF lv_clean_supp IS INITIAL.
            lv_clean_supp = '0'.
          ENDIF.
          ls_item-supplier_no  = lv_clean_supp.
          ls_item-supplier_num = lv_clean_supp.
        ENDIF.
      ENDIF.

      " Fallback ganda jika role tidak spesifik
      IF ls_item-supplier_num IS INITIAL AND ls_item-customer_num IS INITIAL AND lv_bp_guid IS NOT INITIAL.
        SELECT SINGLE vendor FROM cvi_vend_link INTO @lv_cvi_lifnr
          WHERE partner_guid = @lv_bp_guid.
        IF lv_cvi_lifnr IS NOT INITIAL.
          lv_clean_supp = lv_cvi_lifnr.
          SHIFT lv_clean_supp LEFT DELETING LEADING '0'.
          IF lv_clean_supp IS INITIAL.
            lv_clean_supp = '0'.
          ENDIF.
          ls_item-supplier_no  = lv_clean_supp.
          ls_item-supplier_num = lv_clean_supp.
        ENDIF.
        SELECT SINGLE customer FROM cvi_cust_link INTO @lv_cvi_kunnr
          WHERE partner_guid = @lv_bp_guid.
        IF lv_cvi_kunnr IS NOT INITIAL.
          lv_clean_cust = lv_cvi_kunnr.
          SHIFT lv_clean_cust LEFT DELETING LEADING '0'.
          IF lv_clean_cust IS INITIAL.
            lv_clean_cust = '0'.
          ENDIF.
          ls_item-customer_no  = lv_clean_cust.
          ls_item-customer_num = lv_clean_cust.
        ENDIF.
      ENDIF.
    ENDIF.
    APPEND ls_item TO lt_history.
  ENDLOOP.

  SORT lt_history BY req_date DESCENDING req_time DESCENDING.

  lv_json_res = /ui2/cl_json=>serialize(
    data        = lt_history
    compress    = 'X'
    pretty_name = /ui2/cl_json=>pretty_mode-low_case ).

  _m_response->set_content_type( 'application/json' ).
  _m_response->set_cdata( lv_json_res ).
  _m_navigation->response_complete( ).
  RETURN.
ENDIF.

" 3. Handler AJAX: GET_UPLOAD_DETAIL
IF lv_action_ha = 'GET_UPLOAD_DETAIL'.
  lv_req_no_ha = request->get_form_field( 'REQ_NO' ).
  IF lv_req_no_ha IS INITIAL.
    lv_req_no_ha = request->get_form_field( 'UPLOAD_ID' ).
  ENDIF.

  TYPES: BEGIN OF ty_att_json,
           att_no      TYPE i,
           file_name   TYPE string,
           file_type   TYPE string,
           file_size   TYPE i,
           description TYPE string,
           file_base64 TYPE string,
         END OF ty_att_json.

  DATA: lt_att_db   TYPE TABLE OF zmdg_req_att,
        ls_att_db   TYPE zmdg_req_att,
        lt_att_json TYPE TABLE OF ty_att_json,
        ls_att_json TYPE ty_att_json.

  CLEAR: lt_dtl_db, lt_att_db, lt_att_json.

  SELECT * FROM zmdg_stg_part
    WHERE req_no = @lv_req_no_ha
    ORDER BY item_no ASCENDING
    INTO TABLE @lt_dtl_db.

  SELECT * FROM zmdg_req_att
    INTO TABLE @lt_att_db
    WHERE req_no = @lv_req_no_ha
    ORDER BY att_no ASCENDING.

  LOOP AT lt_att_db INTO ls_att_db.
    CLEAR ls_att_json.
    ls_att_json-att_no      = ls_att_db-att_no.
    ls_att_json-file_name   = ls_att_db-file_name.
    ls_att_json-file_type   = ls_att_db-file_type.
    ls_att_json-file_size   = ls_att_db-file_size.
    ls_att_json-description = ls_att_db-description.
    IF ls_att_db-file_data IS NOT INITIAL.
      TRY.
          ls_att_json-file_base64 = cl_http_utility=>encode_x_base64( unencoded = ls_att_db-file_data ).
        CATCH cx_root.
          CLEAR ls_att_json-file_base64.
      ENDTRY.
    ENDIF.
    APPEND ls_att_json TO lt_att_json.
  ENDLOOP.

  TYPES: BEGIN OF ty_upload_detail_resp,
           items       TYPE TABLE OF zmdg_stg_part WITH DEFAULT KEY,
           attachments TYPE TABLE OF ty_att_json WITH DEFAULT KEY,
         END OF ty_upload_detail_resp.

  DATA: ls_upload_detail_resp TYPE ty_upload_detail_resp.
  ls_upload_detail_resp-items       = lt_dtl_db.
  ls_upload_detail_resp-attachments = lt_att_json.

  lv_json_res = /ui2/cl_json=>serialize(
    data        = ls_upload_detail_resp
    compress    = 'X'
    pretty_name = /ui2/cl_json=>pretty_mode-low_case ).

  _m_response->set_content_type( 'application/json' ).
  _m_response->set_cdata( lv_json_res ).
  _m_navigation->response_complete( ).
  RETURN.
ENDIF.