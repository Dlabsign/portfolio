*======================================================================*
* SAP BSP INITIALIZATION CONTROLLER: BUSINESS PARTNER APPROVAL
* Application: MDG Approval | Page: approve_bp.htm
* Schema: Database Staging Table ZMDG_BP_REQ (SE11)
* Workflow: User Request -> Data Steward -> Checked -> Approval BP
*======================================================================*

DATA: lv_action    TYPE string,
      lv_json      TYPE string,
      lv_req_no    TYPE string,
      lv_req_nos   TYPE string,
      lv_reason    TYPE string,
      lv_auth_user TYPE string.

TYPES: BEGIN OF ty_bp_stage_list,
        req_no            TYPE string,
        bp_category       TYPE string,
        bp_role           TYPE string,
        name1             TYPE string,
        name2             TYPE string,
        search_term       TYPE string,
        street            TYPE string,
        house_num         TYPE string,
        city              TYPE string,
        postal_code       TYPE string,
        country           TYPE string,
        region            TYPE string,
        telephone         TYPE string,
        email             TYPE string,
        tax_type          TYPE string,
        tax_num           TYPE string,
        banks             TYPE string,
        bankl             TYPE string,
        bankn             TYPE string,
        koinh             TYPE string,
        bank_name         TYPE string,
        bukrs             TYPE string,
        akont             TYPE string,
        zterm             TYPE string,
        waers             TYPE string,
        status            TYPE string,
        rejection_reason  TYPE string,
        rej_reason        TYPE string,
        remarks           TYPE string,
        sub_reason        TYPE string,
        req_date          TYPE string,
        req_time          TYPE string,
        requestor         TYPE string,
        requestor_name    TYPE string,
        total_item        TYPE i,
        stw_data_status   TYPE string,
        stw_data_by       TYPE string,
        stw_data_name     TYPE string,
        stw_data_at       TYPE string,
        stw_data_note     TYPE string,
        stw_bank_status   TYPE string,
        stw_bank_by       TYPE string,
        stw_bank_name     TYPE string,
        stw_bank_at       TYPE string,
        stw_bank_note     TYPE string,
        appr_final_status TYPE string,
        appr_final_by     TYPE string,
        appr_final_name   TYPE string,
        appr_final_at     TYPE string,
        appr_final_note   TYPE string,
        bp_number         TYPE string,
        created_by        TYPE string,
        created_at        TYPE string,
        changed_by        TYPE string,
        changed_at        TYPE string,
      END OF ty_bp_stage_list.

DATA: lt_list TYPE TABLE OF ty_bp_stage_list,
      ls_list TYPE ty_bp_stage_list.

DATA: lt_bp_db       TYPE TABLE OF zmdg_bp_req,
      ls_bp_db       TYPE zmdg_bp_req,
      lt_req_split   TYPE TABLE OF string,
      lv_req_item    TYPE string,
      lv_has_error   TYPE sap_bool,
      lv_err_msg     TYPE string,
      lv_last_err    TYPE string,
      lv_success_cnt TYPE i,
      lv_fail_cnt    TYPE i,
      lv_ts_now      TYPE timestamp,
      lv_bp_date     TYPE d,
      lv_bp_time     TYPE t.

TYPES: BEGIN OF ty_resp_item,
        req_no    TYPE string,
        bp_number TYPE string,
        name1     TYPE string,
        status    TYPE string,
        message   TYPE string,
      END OF ty_resp_item.

TYPES: BEGIN OF ty_resp,
        status    TYPE string,
        message   TYPE string,
        req_no    TYPE string,
        bp_number TYPE string,
        items     TYPE TABLE OF ty_resp_item WITH DEFAULT KEY,
      END OF ty_resp.

DATA: ls_resp       TYPE ty_resp,
      lt_resp_items TYPE TABLE OF ty_resp_item.

lv_action = request->get_form_field( 'action' ).
IF lv_action IS INITIAL.
  lv_action = request->get_form_field( 'OnInputProcessing' ).
ENDIF.
TRANSLATE lv_action TO UPPER CASE.

lv_auth_user = sy-uname.
TRANSLATE lv_auth_user TO UPPER CASE.
CONDENSE lv_auth_user NO-GAPS.

IF lv_auth_user <> 'ABAPER04' AND lv_auth_user <> 'BASIS' AND lv_auth_user <> 'KMI-BOD' AND lv_auth_user <> 'KMI-U163'.
  IF lv_action IS NOT INITIAL.
    _m_response->set_status( code = 403 reason = 'Forbidden' ).
    _m_response->set_content_type( 'application/json' ).
    _m_response->set_cdata(
      '{"status":"ERROR","message":"Akses Terbatas: Anda tidak memiliki akses."}'
    ).
    _m_navigation->response_complete( ).
    RETURN.
  ENDIF.
ENDIF.

IF lv_action IS NOT INITIAL.

  CASE lv_action.

    " ------------------------------------------------------------------
    " GET COUNTERS FOR APPROVAL METRICS & SIDEBAR BADGES
    " ------------------------------------------------------------------
    WHEN 'GET_COUNTERS'.
      DATA: lv_cnt_mat_p TYPE i,
            lv_cnt_bp_p  TYPE i,
            lv_cnt_ir_p  TYPE i,
            lv_cnt_mat_a TYPE i,
            lv_cnt_bp_a  TYPE i,
            lv_cnt_ir_a  TYPE i,
            lv_cnt_mat_r TYPE i,
            lv_cnt_bp_r  TYPE i,
            lv_cnt_ir_r  TYPE i,
            lv_cnt_tot_a TYPE i,
            lv_cnt_tot_r TYPE i.

      SELECT COUNT( * ) FROM zmdg_req_hdr
        WHERE status IN ( 'CHECKED', 'CODED' )
        INTO @lv_cnt_mat_p.

      SELECT COUNT( * ) FROM zmdg_bp_req
        WHERE status IN ( 'SUBMITTED', 'CHECKED' )
        INTO @lv_cnt_bp_p.

      SELECT COUNT( * ) FROM zmdg_req_pir
        WHERE status = '01'
        INTO @lv_cnt_ir_p.

      SELECT COUNT( * ) FROM zmdg_req_hdr
        WHERE status = 'APPROVED'
        INTO @lv_cnt_mat_a.

      SELECT COUNT( * ) FROM zmdg_bp_req
        WHERE status IN ( 'SD_APPROVED', 'MM_APPROVED', 'APPROVED' )
        INTO @lv_cnt_bp_a.

      SELECT COUNT( * ) FROM zmdg_req_pir
        WHERE status IN ( '02', '04' )
        INTO @lv_cnt_ir_a.

      lv_cnt_tot_a = lv_cnt_mat_a + lv_cnt_bp_a + lv_cnt_ir_a.

      SELECT COUNT( * ) FROM zmdg_req_hdr
        WHERE status IN ( 'REJECTED', 'FAILED' )
        INTO @lv_cnt_mat_r.

      SELECT COUNT( * ) FROM zmdg_bp_req
        WHERE status IN ( 'REJECTED', 'FAILED' )
        INTO @lv_cnt_bp_r.

      SELECT COUNT( * ) FROM zmdg_req_pir
        WHERE status = '03'
        INTO @lv_cnt_ir_r.

      lv_cnt_tot_r = lv_cnt_mat_r + lv_cnt_bp_r + lv_cnt_ir_r.

      lv_json = '{"pending":' && lv_cnt_bp_p &&
                ',"mat_pending":' && lv_cnt_mat_p &&
                ',"bp_pending":' && lv_cnt_bp_p &&
                ',"bp_approved":' && lv_cnt_bp_a &&
                ',"bp_rejected":' && lv_cnt_bp_r &&
                ',"ir_pending":' && lv_cnt_ir_p &&
                ',"approved":' && lv_cnt_tot_a &&
                ',"rejected":' && lv_cnt_tot_r && '}'.
      _m_response->set_content_type( 'application/json' ).
      _m_response->set_cdata( lv_json ).
      _m_navigation->response_complete( ).
      RETURN.

    " ------------------------------------------------------------------
    " 1. GET ALL STAGING REQUEST LIST (CHECKED & APPROVED)
    " ------------------------------------------------------------------
    WHEN 'GET_STAGING_LIST'.
      CLEAR: lt_bp_db, lt_list.

      SELECT * FROM zmdg_bp_req
        INTO TABLE @lt_bp_db
        WHERE status IN ( 'SUBMITTED', 'CHECKED', 'SD_APPROVED', 'MM_APPROVED', 'APPROVED' )
        ORDER BY req_id DESCENDING.

      LOOP AT lt_bp_db INTO ls_bp_db.
        CLEAR ls_list.
        ls_list-req_no            = CONV #( ls_bp_db-req_id ).
        ls_list-bp_category       = CONV #( ls_bp_db-bp_category ).
        ls_list-bp_role           = CONV #( ls_bp_db-bp_role ).
        ls_list-name1             = CONV #( ls_bp_db-name1 ).
        ls_list-name2             = CONV #( ls_bp_db-name2 ).
        ls_list-search_term       = CONV #( ls_bp_db-search_term ).
        ls_list-street            = CONV #( ls_bp_db-street ).
        ls_list-house_num         = CONV #( ls_bp_db-house_num ).
        ls_list-city              = CONV #( ls_bp_db-city ).
        ls_list-postal_code       = CONV #( ls_bp_db-postal_code ).
        ls_list-country           = CONV #( ls_bp_db-country ).
        ls_list-region            = CONV #( ls_bp_db-region ).
        ls_list-telephone         = CONV #( ls_bp_db-telephone ).
        ls_list-email             = CONV #( ls_bp_db-email ).
        ls_list-tax_type          = CONV #( ls_bp_db-tax_type ).
        ls_list-tax_num           = CONV #( ls_bp_db-tax_num ).
        ls_list-banks             = CONV #( ls_bp_db-banks ).
        ls_list-bankl             = CONV #( ls_bp_db-bankl ).
        ls_list-bankn             = CONV #( ls_bp_db-bankn ).
        ls_list-koinh             = CONV #( ls_bp_db-koinh ).
        ls_list-bank_name         = CONV #( ls_bp_db-bank_name ).
        ls_list-bukrs             = CONV #( ls_bp_db-bukrs ).
        ls_list-akont             = CONV #( ls_bp_db-akont ).
        ls_list-zterm             = CONV #( ls_bp_db-zterm ).
        ls_list-waers             = CONV #( ls_bp_db-waers ).
        ls_list-status            = CONV #( ls_bp_db-status ).
        ls_list-rejection_reason  = CONV #( ls_bp_db-rejection_reason ).
        ls_list-rej_reason        = CONV #( ls_bp_db-rejection_reason ).
        ls_list-remarks           = CONV #( ls_bp_db-name1 ).
        ls_list-sub_reason        = |BP: { ls_bp_db-name1 } ({ ls_bp_db-search_term })|.
        ls_list-requestor         = CONV #( ls_bp_db-created_by ).
        ls_list-total_item        = 1.
        ls_list-stw_data_status   = CONV #( ls_bp_db-stw_data_status ).
        ls_list-stw_data_by       = CONV #( ls_bp_db-stw_data_by ).
        ls_list-stw_data_at       = CONV #( ls_bp_db-stw_data_at ).
        ls_list-stw_data_note     = CONV #( ls_bp_db-stw_data_note ).
        ls_list-stw_bank_status   = CONV #( ls_bp_db-stw_bank_status ).
        ls_list-stw_bank_by       = CONV #( ls_bp_db-stw_bank_by ).
        ls_list-stw_bank_at       = CONV #( ls_bp_db-stw_bank_at ).
        ls_list-stw_bank_note     = CONV #( ls_bp_db-stw_bank_note ).
        ls_list-appr_final_status = CONV #( ls_bp_db-appr_final_status ).
        ls_list-appr_final_by     = CONV #( ls_bp_db-appr_final_by ).
        ls_list-appr_final_at     = CONV #( ls_bp_db-appr_final_at ).
        ls_list-appr_final_note   = CONV #( ls_bp_db-appr_final_note ).
        ls_list-bp_number         = CONV #( ls_bp_db-bp_number ).
        ls_list-created_by        = CONV #( ls_bp_db-created_by ).
        ls_list-created_at        = CONV #( ls_bp_db-created_at ).
        ls_list-changed_by        = CONV #( ls_bp_db-changed_by ).
        ls_list-changed_at        = CONV #( ls_bp_db-changed_at ).

        IF ls_bp_db-created_at IS NOT INITIAL.
          CONVERT TIME STAMP ls_bp_db-created_at TIME ZONE sy-zonlo
            INTO DATE lv_bp_date TIME lv_bp_time.
          ls_list-req_date = |{ lv_bp_date+6(2) }.{ lv_bp_date+4(2) }.{ lv_bp_date+0(4) }|.
          ls_list-req_time = |{ lv_bp_time+0(2) }:{ lv_bp_time+2(2) }:{ lv_bp_time+4(2) }|.
        ELSE.
          ls_list-req_date = |{ sy-datum+6(2) }.{ sy-datum+4(2) }.{ sy-datum+0(4) }|.
          ls_list-req_time = |{ sy-uzeit+0(2) }:{ sy-uzeit+2(2) }:{ sy-uzeit+4(2) }|.
        ENDIF.

        APPEND ls_list TO lt_list.
      ENDLOOP.

      " Populate user names with First Name + Last Name via BAPI / USR21+ADRP
      TYPES: BEGIN OF ty_bp_user_map,
               uname    TYPE string,
               fullname TYPE string,
             END OF ty_bp_user_map.
      DATA: lt_bp_user_map  TYPE HASHED TABLE OF ty_bp_user_map
                            WITH UNIQUE KEY uname,
            ls_bp_user_map  TYPE ty_bp_user_map,
            ls_bp_bapi_addr TYPE bapiaddr3,
            lt_bp_bapi_ret  TYPE TABLE OF bapiret2,
            lv_bp_persnum   TYPE usr21-persnumber,
            lv_bp_fname     TYPE adrp-name_first,
            lv_bp_lname     TYPE adrp-name_last,
            lv_bp_uname_tmp TYPE bapibname-bapibname,
            lv_bp_uname_chk TYPE string.

      LOOP AT lt_list ASSIGNING FIELD-SYMBOL(<fs_bp_item>).
        " 1. Requestor Name
        IF <fs_bp_item>-requestor IS NOT INITIAL.
          lv_bp_uname_chk = <fs_bp_item>-requestor.
          READ TABLE lt_bp_user_map INTO ls_bp_user_map
            WITH KEY uname = lv_bp_uname_chk.
          IF sy-subrc <> 0.
            CLEAR: ls_bp_user_map, ls_bp_bapi_addr, lt_bp_bapi_ret.
            ls_bp_user_map-uname = lv_bp_uname_chk.
            lv_bp_uname_tmp = lv_bp_uname_chk.
            CALL FUNCTION 'BAPI_USER_GET_DETAIL'
              EXPORTING
                username = lv_bp_uname_tmp
              IMPORTING
                address  = ls_bp_bapi_addr
              TABLES
                return   = lt_bp_bapi_ret.
            IF ls_bp_bapi_addr-firstname IS NOT INITIAL OR
               ls_bp_bapi_addr-lastname IS NOT INITIAL.
              CONCATENATE ls_bp_bapi_addr-firstname ls_bp_bapi_addr-lastname
                INTO ls_bp_user_map-fullname SEPARATED BY space.
            ELSEIF ls_bp_bapi_addr-fullname IS NOT INITIAL.
              ls_bp_user_map-fullname = ls_bp_bapi_addr-fullname.
            ELSE.
              SELECT SINGLE persnumber FROM usr21
                INTO lv_bp_persnum WHERE bname = lv_bp_uname_chk.
              IF sy-subrc = 0.
                SELECT SINGLE name_first name_last FROM adrp
                  INTO (lv_bp_fname, lv_bp_lname)
                  WHERE persnumber = lv_bp_persnum.
                IF lv_bp_fname IS NOT INITIAL OR lv_bp_lname IS NOT INITIAL.
                  CONCATENATE lv_bp_fname lv_bp_lname
                    INTO ls_bp_user_map-fullname SEPARATED BY space.
                ENDIF.
              ENDIF.
            ENDIF.
            IF ls_bp_user_map-fullname IS INITIAL.
              ls_bp_user_map-fullname = lv_bp_uname_chk.
            ENDIF.
            INSERT ls_bp_user_map INTO TABLE lt_bp_user_map.
          ENDIF.
          <fs_bp_item>-requestor_name = ls_bp_user_map-fullname.
        ENDIF.

        " 2. Data Steward Name
        IF <fs_bp_item>-stw_data_by IS NOT INITIAL.
          lv_bp_uname_chk = <fs_bp_item>-stw_data_by.
          READ TABLE lt_bp_user_map INTO ls_bp_user_map
            WITH KEY uname = lv_bp_uname_chk.
          IF sy-subrc <> 0.
            CLEAR: ls_bp_user_map, ls_bp_bapi_addr, lt_bp_bapi_ret.
            ls_bp_user_map-uname = lv_bp_uname_chk.
            lv_bp_uname_tmp = lv_bp_uname_chk.
            CALL FUNCTION 'BAPI_USER_GET_DETAIL'
              EXPORTING
                username = lv_bp_uname_tmp
              IMPORTING
                address  = ls_bp_bapi_addr
              TABLES
                return   = lt_bp_bapi_ret.
            IF ls_bp_bapi_addr-firstname IS NOT INITIAL OR
               ls_bp_bapi_addr-lastname IS NOT INITIAL.
              CONCATENATE ls_bp_bapi_addr-firstname ls_bp_bapi_addr-lastname
                INTO ls_bp_user_map-fullname SEPARATED BY space.
            ELSEIF ls_bp_bapi_addr-fullname IS NOT INITIAL.
              ls_bp_user_map-fullname = ls_bp_bapi_addr-fullname.
            ELSE.
              SELECT SINGLE persnumber FROM usr21
                INTO lv_bp_persnum WHERE bname = lv_bp_uname_chk.
              IF sy-subrc = 0.
                SELECT SINGLE name_first name_last FROM adrp
                  INTO (lv_bp_fname, lv_bp_lname)
                  WHERE persnumber = lv_bp_persnum.
                IF lv_bp_fname IS NOT INITIAL OR lv_bp_lname IS NOT INITIAL.
                  CONCATENATE lv_bp_fname lv_bp_lname
                    INTO ls_bp_user_map-fullname SEPARATED BY space.
                ENDIF.
              ENDIF.
            ENDIF.
            IF ls_bp_user_map-fullname IS INITIAL.
              ls_bp_user_map-fullname = lv_bp_uname_chk.
            ENDIF.
            INSERT ls_bp_user_map INTO TABLE lt_bp_user_map.
          ENDIF.
          <fs_bp_item>-stw_data_name = ls_bp_user_map-fullname.
        ENDIF.

        " 3. Bank Steward Name
        IF <fs_bp_item>-stw_bank_by IS NOT INITIAL.
          lv_bp_uname_chk = <fs_bp_item>-stw_bank_by.
          READ TABLE lt_bp_user_map INTO ls_bp_user_map
            WITH KEY uname = lv_bp_uname_chk.
          IF sy-subrc <> 0.
            CLEAR: ls_bp_user_map, ls_bp_bapi_addr, lt_bp_bapi_ret.
            ls_bp_user_map-uname = lv_bp_uname_chk.
            lv_bp_uname_tmp = lv_bp_uname_chk.
            CALL FUNCTION 'BAPI_USER_GET_DETAIL'
              EXPORTING
                username = lv_bp_uname_tmp
              IMPORTING
                address  = ls_bp_bapi_addr
              TABLES
                return   = lt_bp_bapi_ret.
            IF ls_bp_bapi_addr-firstname IS NOT INITIAL OR
               ls_bp_bapi_addr-lastname IS NOT INITIAL.
              CONCATENATE ls_bp_bapi_addr-firstname ls_bp_bapi_addr-lastname
                INTO ls_bp_user_map-fullname SEPARATED BY space.
            ELSEIF ls_bp_bapi_addr-fullname IS NOT INITIAL.
              ls_bp_user_map-fullname = ls_bp_bapi_addr-fullname.
            ELSE.
              SELECT SINGLE persnumber FROM usr21
                INTO lv_bp_persnum WHERE bname = lv_bp_uname_chk.
              IF sy-subrc = 0.
                SELECT SINGLE name_first name_last FROM adrp
                  INTO (lv_bp_fname, lv_bp_lname)
                  WHERE persnumber = lv_bp_persnum.
                IF lv_bp_fname IS NOT INITIAL OR lv_bp_lname IS NOT INITIAL.
                  CONCATENATE lv_bp_fname lv_bp_lname
                    INTO ls_bp_user_map-fullname SEPARATED BY space.
                ENDIF.
              ENDIF.
            ENDIF.
            IF ls_bp_user_map-fullname IS INITIAL.
              ls_bp_user_map-fullname = lv_bp_uname_chk.
            ENDIF.
            INSERT ls_bp_user_map INTO TABLE lt_bp_user_map.
          ENDIF.
          <fs_bp_item>-stw_bank_name = ls_bp_user_map-fullname.
        ENDIF.

        " 4. Approver Final Name
        IF <fs_bp_item>-appr_final_by IS NOT INITIAL.
          lv_bp_uname_chk = <fs_bp_item>-appr_final_by.
          READ TABLE lt_bp_user_map INTO ls_bp_user_map
            WITH KEY uname = lv_bp_uname_chk.
          IF sy-subrc <> 0.
            CLEAR: ls_bp_user_map, ls_bp_bapi_addr, lt_bp_bapi_ret.
            ls_bp_user_map-uname = lv_bp_uname_chk.
            lv_bp_uname_tmp = lv_bp_uname_chk.
            CALL FUNCTION 'BAPI_USER_GET_DETAIL'
              EXPORTING
                username = lv_bp_uname_tmp
              IMPORTING
                address  = ls_bp_bapi_addr
              TABLES
                return   = lt_bp_bapi_ret.
            IF ls_bp_bapi_addr-firstname IS NOT INITIAL OR
               ls_bp_bapi_addr-lastname IS NOT INITIAL.
              CONCATENATE ls_bp_bapi_addr-firstname ls_bp_bapi_addr-lastname
                INTO ls_bp_user_map-fullname SEPARATED BY space.
            ELSEIF ls_bp_bapi_addr-fullname IS NOT INITIAL.
              ls_bp_user_map-fullname = ls_bp_bapi_addr-fullname.
            ELSE.
              SELECT SINGLE persnumber FROM usr21
                INTO lv_bp_persnum WHERE bname = lv_bp_uname_chk.
              IF sy-subrc = 0.
                SELECT SINGLE name_first name_last FROM adrp
                  INTO (lv_bp_fname, lv_bp_lname)
                  WHERE persnumber = lv_bp_persnum.
                IF lv_bp_fname IS NOT INITIAL OR lv_bp_lname IS NOT INITIAL.
                  CONCATENATE lv_bp_fname lv_bp_lname
                    INTO ls_bp_user_map-fullname SEPARATED BY space.
                ENDIF.
              ENDIF.
            ENDIF.
            IF ls_bp_user_map-fullname IS INITIAL.
              ls_bp_user_map-fullname = lv_bp_uname_chk.
            ENDIF.
            INSERT ls_bp_user_map INTO TABLE lt_bp_user_map.
          ENDIF.
          <fs_bp_item>-appr_final_name = ls_bp_user_map-fullname.
        ENDIF.
      ENDLOOP.

      lv_json = /ui2/cl_json=>serialize(
        data        = lt_list
        compress    = 'X'
        pretty_name = /ui2/cl_json=>pretty_mode-low_case
      ).
      _m_response->set_content_type( 'application/json' ).
      _m_response->set_cdata( lv_json ).
      _m_navigation->response_complete( ).
      RETURN.

    " ------------------------------------------------------------------
    " 2. FETCH BUSINESS PARTNER DETAIL & DOKUMEN PENDUKUNG (ZTB_BP_DMS_DOC)
    " ------------------------------------------------------------------
    WHEN 'GET_UPLOAD_DETAIL' OR 'GET_BP_DETAIL' OR 'GET_BP_ATTACHMENTS'.
      lv_req_no = request->get_form_field( 'REQ_NO' ).
      IF lv_req_no IS INITIAL.
        lv_req_no = request->get_form_field( 'REQ_ID' ).
      ENDIF.

      CLEAR ls_bp_db.
      SELECT SINGLE * FROM zmdg_bp_req
        INTO @ls_bp_db
        WHERE req_id = @lv_req_no.

      TYPES: BEGIN OF ty_bp_doc_json,
               doc_id        TYPE string,
               req_id        TYPE string,
               file_name     TYPE string,
               file_type     TYPE string,
               mime_type     TYPE string,
               file_desc     TYPE string,
               file_size     TYPE i,
               file_uri      TYPE string,
               file_base64   TYPE string,
               stream_url    TYPE string,
               dokar         TYPE string,
               storage_cat   TYPE string,
               dms_sync_stat TYPE string,
               is_truncated  TYPE sap_bool,
             END OF ty_bp_doc_json.

      TYPES: BEGIN OF ty_bp_det_wrap,
               status      TYPE string,
               message     TYPE string,
               data        TYPE zmdg_bp_req,
               attachments TYPE TABLE OF ty_bp_doc_json WITH DEFAULT KEY,
             END OF ty_bp_det_wrap.

      DATA: ls_bp_wrap  TYPE ty_bp_det_wrap,
            lt_dms_db   TYPE TABLE OF ztb_bp_dms_doc,
            ls_dms_db   TYPE ztb_bp_dms_doc,
            lt_att_db   TYPE TABLE OF zmdg_req_att,
            ls_att_db   TYPE zmdg_req_att,
            lt_dms_json TYPE TABLE OF ty_bp_doc_json,
            ls_dms_json TYPE ty_bp_doc_json,
            lv_b64_full TYPE string,
            lv_mtype    TYPE string.

      CLEAR: lt_dms_db, lt_att_db, lt_dms_json, ls_bp_wrap.

      SELECT * FROM ztb_bp_dms_doc
        INTO TABLE @lt_dms_db
        WHERE req_id = @lv_req_no
        ORDER BY doc_id ASCENDING.

      SELECT * FROM zmdg_req_att
        INTO TABLE @lt_att_db
        WHERE req_no = @lv_req_no
        ORDER BY att_no ASCENDING.

      DATA: lv_cur_tabix TYPE i.

      IF lt_dms_db IS NOT INITIAL.
        LOOP AT lt_dms_db INTO ls_dms_db.
          lv_cur_tabix = sy-tabix.
          CLEAR: ls_dms_json, lv_b64_full, ls_att_db, lv_mtype.
          ls_dms_json-doc_id        = CONV #( ls_dms_db-doc_id ).
          ls_dms_json-req_id        = CONV #( ls_dms_db-req_id ).
          ls_dms_json-file_name     = CONV #( ls_dms_db-file_name ).
          ls_dms_json-file_type     = CONV #( ls_dms_db-file_type ).
          ls_dms_json-mime_type     = CONV #( ls_dms_db-mime_type ).
          ls_dms_json-file_desc     = CONV #( ls_dms_db-file_desc ).
          ls_dms_json-file_size     = ls_dms_db-file_size.
          ls_dms_json-file_uri      = ls_dms_db-file_uri.
          ls_dms_json-dokar         = CONV #( ls_dms_db-dokar ).
          ls_dms_json-storage_cat   = CONV #( ls_dms_db-storage_cat ).
          ls_dms_json-dms_sync_stat = CONV #( ls_dms_db-dms_sync_stat ).
          ls_dms_json-stream_url    = |?action=STREAM_DOC&REQ_NO={ lv_req_no }&DOC_ID={ ls_dms_db-doc_id }&ATT_NO={ lv_cur_tabix }|.

          " Cari apakah data binary utuh tersimpan di tabel zmdg_req_att
          READ TABLE lt_att_db INTO ls_att_db
            WITH KEY file_name = ls_dms_db-file_name.
          IF sy-subrc <> 0.
            READ TABLE lt_att_db INTO ls_att_db INDEX lv_cur_tabix.
          ENDIF.

          IF sy-subrc = 0 AND ls_att_db-file_data IS NOT INITIAL.
            TRY.
                lv_b64_full = cl_http_utility=>encode_x_base64(
                  unencoded = ls_att_db-file_data
                ).
                ls_dms_json-file_base64 = lv_b64_full.
                lv_mtype = ls_dms_json-mime_type.
                IF lv_mtype IS INITIAL OR lv_mtype NA '/'.
                  IF ls_dms_json-file_type = 'PDF'.
                    lv_mtype = 'application/pdf'.
                  ELSE.
                    lv_mtype = |image/{ to_lower( ls_dms_json-file_type ) }|.
                  ENDIF.
                ENDIF.
                ls_dms_json-file_uri = |data:{ lv_mtype };base64,{ lv_b64_full }|.
              CATCH cx_root.
                CLEAR ls_dms_json-file_base64.
            ENDTRY.
          ELSE.
            " Tandai berkas terpotong jika data biner zmdg_req_att kosong
            " dan field FILE_URI di ztb_bp_dms_doc dibatasi Char255
            IF strlen( ls_dms_db-file_uri ) > 0 AND strlen( ls_dms_db-file_uri ) <= 255.
              ls_dms_json-is_truncated = abap_true.
              CLEAR ls_dms_json-stream_url.
            ELSEIF ls_dms_db-file_size > 255 AND strlen( ls_dms_db-file_uri ) <= 255.
              ls_dms_json-is_truncated = abap_true.
              CLEAR ls_dms_json-stream_url.
            ENDIF.
          ENDIF.

          APPEND ls_dms_json TO lt_dms_json.
        ENDLOOP.
      ELSEIF lt_att_db IS NOT INITIAL.
        " Sinkronisasi berkas dari tabel zmdg_req_att jika ztb_bp_dms_doc kosong
        LOOP AT lt_att_db INTO ls_att_db.
          CLEAR: ls_dms_json, lv_b64_full, lv_mtype.
          ls_dms_json-doc_id    = |ATT{ ls_att_db-att_no }|.
          ls_dms_json-req_id    = CONV #( ls_att_db-req_no ).
          ls_dms_json-file_name = CONV #( ls_att_db-file_name ).
          ls_dms_json-file_type = CONV #( ls_att_db-file_type ).
          ls_dms_json-file_desc = CONV #( ls_att_db-description ).
          ls_dms_json-file_size = ls_att_db-file_size.
          ls_dms_json-dokar     = 'ZMD'.
          ls_dms_json-stream_url = |?action=STREAM_DOC&REQ_NO={ lv_req_no }&ATT_NO={ ls_att_db-att_no }|.

          IF ls_att_db-file_type CP '*PDF*' OR ls_att_db-file_name CP '*.pdf*'.
            ls_dms_json-mime_type = 'application/pdf'.
          ELSE.
            ls_dms_json-mime_type = |image/{ to_lower( ls_att_db-file_type ) }|.
          ENDIF.

          IF ls_att_db-file_data IS NOT INITIAL.
            TRY.
                lv_b64_full = cl_http_utility=>encode_x_base64(
                  unencoded = ls_att_db-file_data
                ).
                ls_dms_json-file_base64 = lv_b64_full.
                ls_dms_json-file_uri = |data:{ ls_dms_json-mime_type };base64,{ lv_b64_full }|.
              CATCH cx_root.
                CLEAR ls_dms_json-file_base64.
            ENDTRY.
          ENDIF.
          APPEND ls_dms_json TO lt_dms_json.
        ENDLOOP.
      ENDIF.

      IF ls_bp_db-req_id IS NOT INITIAL OR lt_dms_json IS NOT INITIAL.
        ls_bp_wrap-status      = 'SUCCESS'.
        ls_bp_wrap-message     = 'Data retrieved successfully'.
        ls_bp_wrap-data        = ls_bp_db.
        ls_bp_wrap-attachments = lt_dms_json.
      ELSE.
        ls_bp_wrap-status      = 'ERROR'.
        ls_bp_wrap-message     = |Request BP { lv_req_no } tidak ditemukan.|.
      ENDIF.

      lv_json = /ui2/cl_json=>serialize(
        data        = ls_bp_wrap
        compress    = 'X'
        pretty_name = /ui2/cl_json=>pretty_mode-low_case
      ).

      _m_response->set_content_type( 'application/json' ).
      _m_response->set_cdata( lv_json ).
      _m_navigation->response_complete( ).
      RETURN.

    " ------------------------------------------------------------------
    " 2B. STREAM DOCUMENT CONTENT (DIRECT SECURE BINARY OUTPUT)
    " ------------------------------------------------------------------
    WHEN 'STREAM_DOC' OR 'GET_DOC_FILE' OR 'DOWNLOAD_DOC'.
      lv_req_no = request->get_form_field( 'REQ_NO' ).
      IF lv_req_no IS INITIAL.
        lv_req_no = request->get_form_field( 'REQ_ID' ).
      ENDIF.
      DATA: lv_strm_doc_id TYPE string,
            lv_strm_att_no TYPE i,
            lv_att_num_str TYPE string.
      lv_strm_doc_id = request->get_form_field( 'DOC_ID' ).
      lv_att_num_str = request->get_form_field( 'ATT_NO' ).
      IF lv_att_num_str IS NOT INITIAL AND lv_att_num_str CO '0123456789'.
        lv_strm_att_no = CONV #( lv_att_num_str ).
      ENDIF.

      DATA: ls_strm_att  TYPE zmdg_req_att,
            ls_strm_dms  TYPE ztb_bp_dms_doc,
            lv_strm_data TYPE xstring,
            lv_strm_mime TYPE string,
            lv_strm_fn   TYPE string.

      CLEAR: ls_strm_att, ls_strm_dms, lv_strm_data, lv_strm_mime, lv_strm_fn.

      " 1. Cari detail metadata dokumen di ztb_bp_dms_doc jika DOC_ID diberikan
      IF lv_strm_doc_id IS NOT INITIAL.
        SELECT SINGLE * FROM ztb_bp_dms_doc INTO @ls_strm_dms
          WHERE req_id = @lv_req_no AND doc_id = @lv_strm_doc_id.
      ENDIF.

      " 2. Cari data biner di zmdg_req_att berdasarkan nomor atau nama file
      IF lv_strm_att_no > 0.
        SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att
          WHERE req_no = @lv_req_no AND att_no = @lv_strm_att_no.
      ENDIF.
      IF ls_strm_att-file_data IS INITIAL AND ls_strm_dms-file_name IS NOT INITIAL.
        SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att
          WHERE req_no = @lv_req_no AND file_name = @ls_strm_dms-file_name.
      ENDIF.
      IF ls_strm_att-file_data IS INITIAL AND lv_strm_doc_id IS NOT INITIAL.
        SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att
          WHERE req_no = @lv_req_no
            AND ( file_name = @lv_strm_doc_id OR description = @lv_strm_doc_id ).
      ENDIF.

      IF ls_strm_att-file_data IS NOT INITIAL.
        lv_strm_data = ls_strm_att-file_data.
        lv_strm_fn   = ls_strm_att-file_name.
        lv_strm_mime = ls_strm_att-file_type.
      ELSEIF ls_strm_dms-file_name IS NOT INITIAL.
        " Fallback dari ztb_bp_dms_doc jika data biner zmdg_req_att kosong
        " Hanya decode jika file_uri BUKAN potongan 255 karakter
        IF strlen( ls_strm_dms-file_uri ) > 255 AND ls_strm_dms-file_uri CS 'base64,'.
          lv_strm_fn   = ls_strm_dms-file_name.
          lv_strm_mime = ls_strm_dms-mime_type.
          SPLIT ls_strm_dms-file_uri AT 'base64,' INTO DATA(lv_strm_pfx) DATA(lv_strm_raw).
          TRY.
              lv_strm_data = cl_http_utility=>decode_x_base64(
                encoded = lv_strm_raw
              ).
            CATCH cx_root.
              CLEAR lv_strm_data.
          ENDTRY.
        ENDIF.
      ENDIF.

      IF lv_strm_data IS NOT INITIAL.
        IF lv_strm_mime IS INITIAL OR lv_strm_mime NA '/'.
          DATA(lv_ext_chk) = to_upper( lv_strm_fn ).
          IF lv_ext_chk CP '*.PDF'.
            lv_strm_mime = 'application/pdf'.
          ELSEIF lv_ext_chk CP '*.PNG'.
            lv_strm_mime = 'image/png'.
          ELSEIF lv_ext_chk CP '*.JPG' OR lv_ext_chk CP '*.JPEG'.
            lv_strm_mime = 'image/jpeg'.
          ELSEIF lv_ext_chk CP '*.WEBP'.
            lv_strm_mime = 'image/webp'.
          ELSE.
            lv_strm_mime = 'application/octet-stream'.
          ENDIF.
        ENDIF.

        _m_response->set_header_field(
          name  = 'Content-Type'
          value = lv_strm_mime
        ).
        _m_response->set_header_field(
          name  = 'Content-Disposition'
          value = |inline; filename="{ lv_strm_fn }"|
        ).
        _m_response->set_data( data = lv_strm_data ).
        _m_navigation->response_complete( ).
        RETURN.
      ELSE.
        _m_response->set_status( code = 404 reason = 'Not Found' ).
        _m_response->set_content_type( 'application/json' ).
        _m_response->set_cdata(
          '{"status":"ERROR","message":"Berkas dokumen tidak ditemukan atau konten kosong."}'
        ).
        _m_navigation->response_complete( ).
        RETURN.
      ENDIF.

    " ------------------------------------------------------------------
    " 3. QUICK / BULK APPROVE BUSINESS PARTNER
    " Standard SAP BP Creation via Number Range BU_PARTNER & BAPI_BUPA
    " ------------------------------------------------------------------
    WHEN 'QUICK_APPROVE' OR 'BULK_APPROVE'.
      lv_req_nos = request->get_form_field( 'REQ_NOS' ).
      IF lv_req_nos IS INITIAL.
        lv_req_nos = request->get_form_field( 'REQ_NO' ).
      ENDIF.

      SPLIT lv_req_nos AT ',' INTO TABLE lt_req_split.
      lv_success_cnt = 0.
      lv_fail_cnt    = 0.
      CLEAR: lv_last_err, lt_resp_items.

      GET TIME STAMP FIELD lv_ts_now.

      LOOP AT lt_req_split INTO lv_req_item.
        CONDENSE lv_req_item.
        CHECK lv_req_item IS NOT INITIAL.

        CLEAR ls_bp_db.
        SELECT SINGLE * FROM zmdg_bp_req
          INTO @ls_bp_db
          WHERE req_id = @lv_req_item.
        IF sy-subrc <> 0.
          lv_fail_cnt = lv_fail_cnt + 1.
          lv_last_err = |Request { lv_req_item } tidak ditemukan.|.
          APPEND VALUE ty_resp_item(
            req_no  = lv_req_item
            status  = 'ERROR'
            message = lv_last_err
          ) TO lt_resp_items.
          CONTINUE.
        ENDIF.

        " Cek kelayakan approval (Tahap 1: Request Baru / SUBMITTED / CHECKED / APPROVED)
        IF ls_bp_db-status <> 'SUBMITTED' AND ls_bp_db-status <> 'CHECKED' AND ls_bp_db-status <> 'SD_APPROVED' AND ls_bp_db-status <> 'MM_APPROVED'.
          lv_fail_cnt = lv_fail_cnt + 1.
          lv_last_err = |Request { lv_req_item } (Status { ls_bp_db-status }) belum memenuhi syarat approval.|.
          APPEND VALUE ty_resp_item(
            req_no  = lv_req_item
            status  = 'ERROR'
            message = lv_last_err
          ) TO lt_resp_items.
          CONTINUE.
        ENDIF.

        " --------------------------------------------------------------
        " MEKANISME STANDARD SAP UNTUK GENERATE NOMOR BP & CREATE MASTER
        " SESUAI KONFIGURASI SPRO (INTERNAL NUMBER ASSIGNMENT GROUPING)
        " --------------------------------------------------------------
        DATA: lv_gen_bp_num TYPE bu_partner,
              lv_grouping   TYPE bu_group,
              lv_bapi_err   TYPE string.

        CLEAR: lv_gen_bp_num, lv_grouping, lv_bapi_err.

        IF ls_bp_db-bp_number IS NOT INITIAL.
          lv_gen_bp_num = ls_bp_db-bp_number.
        ELSE.
          " 1. Ambil Grouping BP dari record staging / permohonan (SPRO Grouping)
          IF ls_bp_db-bu_group IS NOT INITIAL.
            lv_grouping = ls_bp_db-bu_group.
          ELSE.
            SELECT SINGLE bu_group FROM tb001
              INTO @lv_grouping
             WHERE bu_group IN ( '0001', 'BP01', 'V001', 'Z001' ).
            IF sy-subrc <> 0.
              lv_grouping = '0001'.
            ENDIF.
          ENDIF.

          DATA: ls_central        TYPE bapibus1006_central,
                ls_central_org    TYPE bapibus1006_central_organ,
                ls_central_person TYPE bapibus1006_central_person,
                ls_address        TYPE bapibus1006_address,
                lt_telefondata    TYPE TABLE OF bapiadtel,
                ls_telefondata    TYPE bapiadtel,
                lt_faxdata        TYPE TABLE OF bapiadfax,
                ls_faxdata        TYPE bapiadfax,
                lt_e_maildata     TYPE TABLE OF bapiadsmtp,
                ls_e_maildata     TYPE bapiadsmtp,
                lt_bapi_ret       TYPE TABLE OF bapiret2,
                ls_bapi_ret       TYPE bapiret2.

          CLEAR: ls_central, ls_central_org, ls_central_person,
                 ls_address, lt_telefondata, lt_faxdata, lt_e_maildata, lt_bapi_ret.

          ls_central-searchterm1 = ls_bp_db-search_term.
          ls_central-title_key   = '0003'. " 0003 = Company / Perusahaan (TSAD3 Standard)

          IF ls_bp_db-bp_category = '1'.
            ls_central_person-firstname = ls_bp_db-name2.
            ls_central_person-lastname  = ls_bp_db-name1.
          ELSE.
            ls_central_org-name1 = ls_bp_db-name1.
            ls_central_org-name2 = ls_bp_db-name2.
          ENDIF.

          ls_address-street     = ls_bp_db-street.
          ls_address-house_no   = ls_bp_db-house_num.
          ls_address-city       = ls_bp_db-city.
          ls_address-postl_cod1 = ls_bp_db-postal_code.
          ls_address-country    = COND #( WHEN ls_bp_db-country IS NOT INITIAL THEN ls_bp_db-country ELSE 'ID' ).
          ls_address-region     = ls_bp_db-region.
          IF ls_bp_db-langu IS NOT INITIAL.
            DATA: lv_spras_val TYPE spras.
            CALL FUNCTION 'CONVERSION_EXIT_ISOLA_INPUT'
              EXPORTING input  = ls_bp_db-langu
              IMPORTING output = lv_spras_val
              EXCEPTIONS OTHERS = 1.
            IF sy-subrc = 0 AND lv_spras_val IS NOT INITIAL.
              ls_address-langu = lv_spras_val.
            ELSE.
              ls_address-langu = sy-langu.
            ENDIF.
          ELSE.
            ls_address-langu = sy-langu.
          ENDIF.

          IF ls_bp_db-telephone IS NOT INITIAL.
            CLEAR ls_telefondata.
            ls_telefondata-telephone = ls_bp_db-telephone.
            APPEND ls_telefondata TO lt_telefondata.
          ENDIF.

          IF ls_bp_db-fax IS NOT INITIAL.
            CLEAR ls_faxdata.
            ls_faxdata-fax = ls_bp_db-fax.
            APPEND ls_faxdata TO lt_faxdata.
          ENDIF.

          IF ls_bp_db-email IS NOT INITIAL.
            CLEAR ls_e_maildata.
            ls_e_maildata-e_mail = ls_bp_db-email.
            APPEND ls_e_maildata TO lt_e_maildata.
          ENDIF.

          " 3. Panggil BAPI_BUPA_CREATE_FROM_DATA - SAP akan otomatis memicu SPRO Number Range sesuai Grouping
          CALL FUNCTION 'BAPI_BUPA_CREATE_FROM_DATA'
            EXPORTING
              partnercategory         = COND #( WHEN ls_bp_db-bp_category IS NOT INITIAL THEN ls_bp_db-bp_category ELSE '2' )
              partnergroup            = lv_grouping
              centraldata             = ls_central
              centraldataorganization = ls_central_org
              centraldataperson       = ls_central_person
              addressdata             = ls_address
            IMPORTING
              businesspartner         = lv_gen_bp_num
            TABLES
              telefondata             = lt_telefondata
              faxdata                 = lt_faxdata
              e_maildata              = lt_e_maildata
              return                  = lt_bapi_ret.
        ENDIF.

        " Format nomor BP menjadi standard SAP 10 digit (ALPHA conversion)
        IF lv_gen_bp_num IS NOT INITIAL.
          CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
            EXPORTING
              input  = lv_gen_bp_num
            IMPORTING
              output = lv_gen_bp_num.
        ENDIF.

        IF lv_gen_bp_num IS NOT INITIAL.
          " Tambahkan Role (Unified Vendor Roles: FLVN01 + FLVN00, Customer: FLCU01 + FLCU00)
          DATA: lt_role_ret TYPE TABLE OF bapiret2.

          IF ls_bp_db-bp_role CS 'CU' OR ls_bp_db-bu_group CP 'C*'.
            CALL FUNCTION 'BAPI_BUPA_ROLE_ADD_2'
              EXPORTING
                businesspartner     = lv_gen_bp_num
                businesspartnerrole = 'FLCU01'
              TABLES return = lt_role_ret.
            CALL FUNCTION 'BAPI_BUPA_ROLE_ADD_2'
              EXPORTING
                businesspartner     = lv_gen_bp_num
                businesspartnerrole = 'FLCU00'
              TABLES return = lt_role_ret.
          ELSE.
            CALL FUNCTION 'BAPI_BUPA_ROLE_ADD_2'
              EXPORTING
                businesspartner     = lv_gen_bp_num
                businesspartnerrole = 'FLVN01'
              TABLES return = lt_role_ret.
            CALL FUNCTION 'BAPI_BUPA_ROLE_ADD_2'
              EXPORTING
                businesspartner     = lv_gen_bp_num
                businesspartnerrole = 'FLVN00'
              TABLES return = lt_role_ret.
          ENDIF.

          CALL FUNCTION 'BAPI_BUPA_ROLE_ADD_2'
            EXPORTING
              businesspartner     = lv_gen_bp_num
              businesspartnerrole = '000000'
            TABLES return = lt_role_ret.

          " Tambahkan Data Bank jika ada
          IF ls_bp_db-bankn IS NOT INITIAL AND ls_bp_db-bankl IS NOT INITIAL.
            DATA: ls_bank_param TYPE bapibus1006_bankdetail,
                  lt_bank_ret   TYPE TABLE OF bapiret2.
            ls_bank_param-bank_ctry     = COND #(
              WHEN ls_bp_db-banks IS NOT INITIAL
              THEN ls_bp_db-banks ELSE 'ID' ).
            ls_bank_param-bank_key      = ls_bp_db-bankl.
            ls_bank_param-bank_acct     = ls_bp_db-bankn.
            ls_bank_param-accountholder = COND #(
              WHEN ls_bp_db-koinh IS NOT INITIAL
              THEN ls_bp_db-koinh ELSE ls_bp_db-name1 ).

            CALL FUNCTION 'BAPI_BUPA_BANKDETAIL_ADD'
              EXPORTING
                businesspartner = lv_gen_bp_num
                bankdetailid    = '0001'
                bankdetaildata  = ls_bank_param
              TABLES return = lt_bank_ret.

            DATA: ls_b_ret TYPE bapiret2.
            LOOP AT lt_bank_ret INTO ls_b_ret WHERE type = 'E' OR type = 'A'.
              IF lv_bapi_err IS INITIAL.
                lv_bapi_err = |[Bank Error]: { ls_b_ret-message }|.
              ELSE.
                lv_bapi_err = |{ lv_bapi_err } / { ls_b_ret-message }|.
              ENDIF.
            ENDLOOP.
          ENDIF.

          " Tambahkan Tax / NPWP jika ada
          IF ls_bp_db-tax_num IS NOT INITIAL.
            DATA: lt_tax_ret TYPE TABLE OF bapiret2.
            CALL FUNCTION 'BAPI_BUPA_TAX_ADD'
              EXPORTING
                businesspartner = lv_gen_bp_num
                taxtype         = COND #(
                  WHEN ls_bp_db-tax_type IS NOT INITIAL
                  THEN ls_bp_db-tax_type ELSE 'ID1' )
                taxnumber       = ls_bp_db-tax_num
              TABLES return = lt_tax_ret.
          ENDIF.

          " Commit perubahan master data ke SAP
          CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
            EXPORTING wait = 'X'.

          " 9. Ekstensi Master Data View Sesuai Peran (Vendor vs Customer)
          IF ls_bp_db-bp_role CS 'VN' OR ls_bp_db-bp_role CS 'VE' OR ls_bp_db-bu_group CP 'S*' OR ls_bp_db-bu_group CP 'V*'.
            " ----------------------------------------------------------
            " VENDOR EXTENSION (LFA1, LFM1, LFB1, CVI_VEND_LINK)
            " ----------------------------------------------------------
            DATA: lv_ekorg_val TYPE ekorg,
                  lv_bukrs_val TYPE bukrs,
                  lv_waers_val TYPE waers,
                  lv_webre_val TYPE webre,
                  lv_lebre_val TYPE lebre,
                  lv_cvi_lifnr TYPE lifnr,
                  ls_lfm1_ins  TYPE lfm1,
                  ls_lfb1_ins  TYPE lfb1,
                  ls_lfa1_ins  TYPE lfa1,
                  ls_cvi_link  TYPE cvi_vend_link,
                  lv_bp_guid   TYPE bu_partner_guid.

            lv_ekorg_val = COND #( WHEN ls_bp_db-ekorg IS NOT INITIAL THEN ls_bp_db-ekorg ELSE '1000' ).
            lv_bukrs_val = COND #( WHEN ls_bp_db-bukrs IS NOT INITIAL THEN ls_bp_db-bukrs ELSE '1000' ).
            lv_waers_val = COND #( WHEN ls_bp_db-waers IS NOT INITIAL THEN ls_bp_db-waers ELSE 'IDR' ).
            lv_webre_val = COND #( WHEN ls_bp_db-webre IS NOT INITIAL THEN ls_bp_db-webre ELSE 'X' ).
            lv_lebre_val = COND #( WHEN ls_bp_db-lebre IS NOT INITIAL THEN ls_bp_db-lebre ELSE 'X' ).

            lv_cvi_lifnr = lv_gen_bp_num.
            CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
              EXPORTING input  = lv_cvi_lifnr
              IMPORTING output = lv_cvi_lifnr.

            SELECT SINGLE partner_guid FROM but000 INTO @lv_bp_guid WHERE partner = @lv_gen_bp_num.
            IF sy-subrc = 0 AND lv_bp_guid IS NOT INITIAL.
              SELECT SINGLE vendor FROM cvi_vend_link INTO @lv_cvi_lifnr WHERE partner_guid = @lv_bp_guid.
              IF sy-subrc <> 0 OR lv_cvi_lifnr IS INITIAL.
                lv_cvi_lifnr = lv_gen_bp_num.
                CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
                  EXPORTING input  = lv_cvi_lifnr
                  IMPORTING output = lv_cvi_lifnr.

                ls_cvi_link-client       = sy-mandt.
                ls_cvi_link-partner_guid = lv_bp_guid.
                ls_cvi_link-vendor       = lv_cvi_lifnr.
                MODIFY cvi_vend_link FROM @ls_cvi_link.
              ENDIF.
            ENDIF.

            SELECT SINGLE * FROM lfa1 INTO @ls_lfa1_ins WHERE lifnr = @lv_cvi_lifnr.
            ls_lfa1_ins-mandt = sy-mandt.
            ls_lfa1_ins-lifnr = lv_cvi_lifnr.
            ls_lfa1_ins-name1 = ls_bp_db-name1.
            ls_lfa1_ins-name2 = ls_bp_db-name2.
            ls_lfa1_ins-sortl = ls_bp_db-search_term.
            ls_lfa1_ins-stras = ls_bp_db-street.
            ls_lfa1_ins-ort01 = ls_bp_db-city.
            ls_lfa1_ins-pstlz = ls_bp_db-postal_code.
            ls_lfa1_ins-land1 = COND #( WHEN ls_bp_db-country IS NOT INITIAL THEN ls_bp_db-country ELSE 'ID' ).
            ls_lfa1_ins-regio = ls_bp_db-region.
            ls_lfa1_ins-telf1 = ls_bp_db-telephone.
            ls_lfa1_ins-telfx = ls_bp_db-fax.
            IF ls_lfa1_ins-ktokk IS INITIAL.
              ls_lfa1_ins-ktokk = COND #( WHEN ls_bp_db-bu_group IS NOT INITIAL THEN ls_bp_db-bu_group ELSE 'S001' ).
            ENDIF.
            IF ls_lfa1_ins-erdat IS INITIAL.
              ls_lfa1_ins-erdat = sy-datum.
              ls_lfa1_ins-ernam = sy-uname.
            ENDIF.
            MODIFY lfa1 FROM @ls_lfa1_ins.

            SELECT SINGLE * FROM lfm1 INTO @ls_lfm1_ins WHERE lifnr = @lv_cvi_lifnr AND ekorg = @lv_ekorg_val.
            ls_lfm1_ins-mandt = sy-mandt.
            ls_lfm1_ins-lifnr = lv_cvi_lifnr.
            ls_lfm1_ins-ekorg = lv_ekorg_val.
            ls_lfm1_ins-waers = lv_waers_val.
            ls_lfm1_ins-webre = lv_webre_val.
            ls_lfm1_ins-lebre = lv_lebre_val.
            IF ls_lfm1_ins-erdat IS INITIAL.
              ls_lfm1_ins-erdat = sy-datum.
              ls_lfm1_ins-ernam = sy-uname.
            ENDIF.
            MODIFY lfm1 FROM @ls_lfm1_ins.

            SELECT SINGLE * FROM lfb1 INTO @ls_lfb1_ins WHERE lifnr = @lv_cvi_lifnr AND bukrs = @lv_bukrs_val.
            ls_lfb1_ins-mandt = sy-mandt.
            ls_lfb1_ins-lifnr = lv_cvi_lifnr.
            ls_lfb1_ins-bukrs = lv_bukrs_val.
            ls_lfb1_ins-akont = ls_bp_db-akont.
            ls_lfb1_ins-zterm = ls_bp_db-zterm.
            IF ls_lfb1_ins-erdat IS INITIAL.
              ls_lfb1_ins-erdat = sy-datum.
              ls_lfb1_ins-ernam = sy-uname.
            ENDIF.
            MODIFY lfb1 FROM @ls_lfb1_ins.

            IF sy-subrc = 0.
              COMMIT WORK AND WAIT.
            ENDIF.

          ELSE.
            " ----------------------------------------------------------
            " CUSTOMER EXTENSION (KNA1, KNB1, CVI_CUST_LINK) - T077D Check
            " ----------------------------------------------------------
            DATA: lv_bukrs_cust TYPE bukrs,
                  lv_cvi_kunnr  TYPE kunnr,
                  ls_knb1_ins   TYPE knb1,
                  ls_kna1_ins   TYPE kna1,
                  ls_cvi_clink  TYPE cvi_cust_link,
                  lv_bp_cguid   TYPE bu_partner_guid.

            lv_bukrs_cust = COND #( WHEN ls_bp_db-bukrs IS NOT INITIAL THEN ls_bp_db-bukrs ELSE '1000' ).
            lv_cvi_kunnr  = lv_gen_bp_num.
            CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
              EXPORTING input  = lv_cvi_kunnr
              IMPORTING output = lv_cvi_kunnr.

            SELECT SINGLE partner_guid FROM but000 INTO @lv_bp_cguid WHERE partner = @lv_gen_bp_num.
            IF sy-subrc = 0 AND lv_bp_cguid IS NOT INITIAL.
              SELECT SINGLE customer FROM cvi_cust_link INTO @lv_cvi_kunnr WHERE partner_guid = @lv_bp_cguid.
              IF sy-subrc <> 0 OR lv_cvi_kunnr IS INITIAL.
                lv_cvi_kunnr = lv_gen_bp_num.
                CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
                  EXPORTING input  = lv_cvi_kunnr
                  IMPORTING output = lv_cvi_kunnr.

                ls_cvi_clink-client       = sy-mandt.
                ls_cvi_clink-partner_guid = lv_bp_cguid.
                ls_cvi_clink-customer     = lv_cvi_kunnr.
                MODIFY cvi_cust_link FROM @ls_cvi_clink.
              ENDIF.
            ENDIF.

            SELECT SINGLE * FROM kna1 INTO @ls_kna1_ins WHERE kunnr = @lv_cvi_kunnr.
            ls_kna1_ins-mandt = sy-mandt.
            ls_kna1_ins-kunnr = lv_cvi_kunnr.
            ls_kna1_ins-name1 = ls_bp_db-name1.
            ls_kna1_ins-name2 = ls_bp_db-name2.
            ls_kna1_ins-sortl = ls_bp_db-search_term.
            ls_kna1_ins-stras = ls_bp_db-street.
            ls_kna1_ins-ort01 = ls_bp_db-city.
            ls_kna1_ins-pstlz = ls_bp_db-postal_code.
            ls_kna1_ins-land1 = COND #( WHEN ls_bp_db-country IS NOT INITIAL THEN ls_bp_db-country ELSE 'ID' ).
            ls_kna1_ins-regio = ls_bp_db-region.
            ls_kna1_ins-telf1 = ls_bp_db-telephone.
            ls_kna1_ins-telfx = ls_bp_db-fax.
            IF ls_kna1_ins-ktokd IS INITIAL.
              ls_kna1_ins-ktokd = COND #( WHEN ls_bp_db-bu_group IS NOT INITIAL THEN ls_bp_db-bu_group ELSE 'C001' ).
            ENDIF.
            IF ls_kna1_ins-erdat IS INITIAL.
              ls_kna1_ins-erdat = sy-datum.
              ls_kna1_ins-ernam = sy-uname.
            ENDIF.
            MODIFY kna1 FROM @ls_kna1_ins.

            SELECT SINGLE * FROM knb1 INTO @ls_knb1_ins WHERE kunnr = @lv_cvi_kunnr AND bukrs = @lv_bukrs_cust.
            ls_knb1_ins-mandt = sy-mandt.
            ls_knb1_ins-kunnr = lv_cvi_kunnr.
            ls_knb1_ins-bukrs = lv_bukrs_cust.
            ls_knb1_ins-akont = ls_bp_db-akont.
            ls_knb1_ins-zterm = ls_bp_db-zterm.
            IF ls_knb1_ins-erdat IS INITIAL.
              ls_knb1_ins-erdat = sy-datum.
              ls_knb1_ins-ernam = sy-uname.
            ENDIF.
            MODIFY knb1 FROM @ls_knb1_ins.

            IF sy-subrc = 0.
              COMMIT WORK AND WAIT.
            ENDIF.
          ENDIF.

          " Tentukan status lanjutan: Customer -> SD_APPROVED, Vendor -> MM_APPROVED (keduanya lanjut Bank Steward)
          DATA: lv_next_stat TYPE char20,
                lv_succ_msg  TYPE string.

          IF ls_bp_db-bp_role CS 'CU' OR ls_bp_db-bu_group CP 'C*'.
            lv_next_stat = 'SD_APPROVED'.
            lv_succ_msg  = |BP SAP { lv_gen_bp_num } (SD Customer FLCU01) berhasil di-approve! Diteruskan ke Bank Steward untuk BP Role FLCU00 (FI Customer).|.
          ELSE.
            lv_next_stat = 'MM_APPROVED'.
            lv_succ_msg  = |BP SAP { lv_gen_bp_num } (MM Supplier FLVN01) berhasil di-approve! Diteruskan ke Bank Steward untuk BP Role FLVN00 (FI Supplier).|.
          ENDIF.

          " Update Status dan Nomor BP ke Tabel Staging ZMDG_BP_REQ
          UPDATE zmdg_bp_req
            SET status            = @lv_next_stat,
                rejection_reason  = '',
                appr_final_status = 'X',
                appr_final_by     = @sy-uname,
                appr_final_at     = @lv_ts_now,
                bp_number         = @lv_gen_bp_num,
                error_log         = @lv_bapi_err,
                changed_by        = @sy-uname,
                changed_at        = @lv_ts_now
            WHERE req_id = @lv_req_item.

          IF sy-subrc = 0.
            COMMIT WORK.
            lv_success_cnt = lv_success_cnt + 1.
            APPEND VALUE ty_resp_item(
              req_no    = lv_req_item
              bp_number = CONV #( lv_gen_bp_num )
              name1     = CONV #( ls_bp_db-name1 )
              status    = 'SUCCESS'
              message   = lv_succ_msg
            ) TO lt_resp_items.
          ELSE.
            ROLLBACK WORK.
            lv_fail_cnt = lv_fail_cnt + 1.
            lv_last_err = |Gagal update status staging request { lv_req_item }.|.
            APPEND VALUE ty_resp_item(
              req_no    = lv_req_item
              bp_number = CONV #( lv_gen_bp_num )
              name1     = CONV #( ls_bp_db-name1 )
              status    = 'ERROR'
              message   = lv_last_err
            ) TO lt_resp_items.
          ENDIF.

        ELSE.
          " Jika generate nomor BP SAP gagal
          CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
          CLEAR lv_bapi_err.
          LOOP AT lt_bapi_ret INTO ls_bapi_ret WHERE type = 'E' OR type = 'A'.
            IF lv_bapi_err IS INITIAL.
              lv_bapi_err = ls_bapi_ret-message.
            ELSE.
              CONCATENATE lv_bapi_err ls_bapi_ret-message
                INTO lv_bapi_err SEPARATED BY ' | '.
            ENDIF.
          ENDLOOP.
          IF lv_bapi_err IS INITIAL.
            lv_bapi_err = 'Gagal alokasi nomor BP dari SAP number range object BU_PARTNER.'.
          ENDIF.

          UPDATE zmdg_bp_req
            SET status            = 'FAILED',
                appr_final_status = 'R',
                appr_final_by     = @sy-uname,
                appr_final_at     = @lv_ts_now,
                error_log         = @lv_bapi_err,
                changed_by        = @sy-uname,
                changed_at        = @lv_ts_now
            WHERE req_id = @lv_req_item.
          COMMIT WORK.

          lv_fail_cnt = lv_fail_cnt + 1.
          lv_last_err = |Gagal generate BP SAP: { lv_bapi_err }|.
          APPEND VALUE ty_resp_item(
            req_no    = lv_req_item
            bp_number = ''
            name1     = CONV #( ls_bp_db-name1 )
            status    = 'ERROR'
            message   = lv_last_err
          ) TO lt_resp_items.
        ENDIF.
      ENDLOOP.

      CLEAR ls_resp.
      ls_resp-items = lt_resp_items.

      IF lv_fail_cnt > 0 AND lv_success_cnt = 0.
        ls_resp-status  = 'ERROR'.
        ls_resp-message = 'Proses approval & pembuatan BP SAP gagal: ' && lv_last_err.
      ELSEIF lv_fail_cnt > 0 AND lv_success_cnt > 0.
        ls_resp-status  = 'PARTIAL'.
        ls_resp-message = lv_success_cnt && ' BP BERHASIL dibuat di SAP, ' &&
                          lv_fail_cnt && ' GAGAL. Error: ' && lv_last_err.
      ELSE.
        ls_resp-status  = 'SUCCESS'.
        IF lv_success_cnt = 1.
          READ TABLE lt_resp_items INTO DATA(ls_first_succ) INDEX 1.
          ls_resp-req_no    = ls_first_succ-req_no.
          ls_resp-bp_number = ls_first_succ-bp_number.
          ls_resp-message   = |Permohonan Business Partner { ls_first_succ-req_no } | &&
                              |berhasil di-approve! Nomor BP: { ls_first_succ-bp_number }.|.
        ELSE.
          ls_resp-message = |{ lv_success_cnt } Business Partner berhasil di-approve | &&
                            |dan dibuat di SAP!|.
        ENDIF.
      ENDIF.

      lv_json = /ui2/cl_json=>serialize(
        data        = ls_resp
        compress    = 'X'
        pretty_name = /ui2/cl_json=>pretty_mode-low_case
      ).
      _m_response->set_content_type( 'application/json' ).
      _m_response->set_cdata( lv_json ).
      _m_navigation->response_complete( ).
      RETURN.

    " ------------------------------------------------------------------
    " 4. BULK / SINGLE REJECT WITH REASON
    " ------------------------------------------------------------------
    WHEN 'BULK_REJECT' OR 'QUICK_REJECT' OR 'REJECT'.
      lv_req_nos = request->get_form_field( 'REQ_NOS' ).
      IF lv_req_nos IS INITIAL.
        lv_req_nos = request->get_form_field( 'REQ_NO' ).
      ENDIF.

      lv_reason = request->get_form_field( 'REJ_REASON' ).

      SPLIT lv_req_nos AT ',' INTO TABLE lt_req_split.
      GET TIME STAMP FIELD lv_ts_now.

      LOOP AT lt_req_split INTO lv_req_item.
        CONDENSE lv_req_item.
        CHECK lv_req_item IS NOT INITIAL.

        UPDATE zmdg_bp_req
          SET status            = 'REJECTED',
              rejection_reason  = @lv_reason,
              appr_final_status = 'R',
              appr_final_by     = @sy-uname,
              appr_final_at     = @lv_ts_now,
              appr_final_note   = @lv_reason,
              changed_by        = @sy-uname,
              changed_at        = @lv_ts_now
          WHERE req_id = @lv_req_item.
      ENDLOOP.
      COMMIT WORK.

      lv_json = '{"status":"SUCCESS","message":' &&
                '"Permohonan Business Partner berhasil ditolak!"}'.
      _m_response->set_content_type( 'application/json' ).
      _m_response->set_cdata( lv_json ).
      _m_navigation->response_complete( ).
      RETURN.

    " ------------------------------------------------------------------
    " 5. LOGOUT
    " ------------------------------------------------------------------
    WHEN 'LOGOUT'.
      _m_navigation->exit( ).
      RETURN.

  ENDCASE.

ENDIF.