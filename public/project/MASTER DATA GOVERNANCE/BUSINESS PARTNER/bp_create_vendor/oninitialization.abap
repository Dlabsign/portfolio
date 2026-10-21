*======================================================================*
* BSP EVENT HANDLER: OnInitialization
* Application: ZBP_REQUEST | Page: bp_create_request.htm
* Standard T-Code: BP (Create Organization - Address & General Data)
* Staging Table: ZMDG_BP_REQ
*======================================================================*

CLEAR: gt_messages.

" ----------------------------------------------------------------------
" 0. INTERCEPT AJAX / API ACTIONS (SEARCH_BANKS untuk Dialog Find Bank SAP)
" ----------------------------------------------------------------------
DATA: lv_init_action TYPE string.
lv_init_action = request->get_form_field( 'action' ).
IF lv_init_action IS INITIAL.
  lv_init_action = request->get_form_field( 'OnInputProcessing' ).
ENDIF.
IF lv_init_action IS INITIAL.
  lv_init_action = request->get_form_field( 'onInputProcessing' ).
ENDIF.
TRANSLATE lv_init_action TO UPPER CASE.

IF lv_init_action = 'SEARCH_BANKS' OR lv_init_action = 'FIND_BANK'.
  DATA: lv_s_banks   TYPE string,
        lv_s_bankk   TYPE string,
        lv_s_banka   TYPE string,
        lv_s_ort01   TYPE string,
        lv_s_bnklz   TYPE string,
        lv_s_swift   TYPE string,
        lv_s_brnch   TYPE string,
        lv_s_stras   TYPE string,
        lv_s_max_str TYPE string,
        lv_max_rows  TYPE i VALUE 500.

  lv_s_banks   = request->get_form_field( 'banks' ).
  lv_s_bankk   = request->get_form_field( 'bankk' ).
  IF lv_s_bankk IS INITIAL.
    lv_s_bankk = request->get_form_field( 'bankl' ).
  ENDIF.
  lv_s_banka   = request->get_form_field( 'banka' ).
  lv_s_ort01   = request->get_form_field( 'ort01' ).
  lv_s_bnklz   = request->get_form_field( 'bnklz' ).
  IF lv_s_bnklz IS INITIAL.
    lv_s_bnklz = request->get_form_field( 'bank_number' ).
  ENDIF.
  lv_s_swift   = request->get_form_field( 'swift' ).
  lv_s_brnch   = request->get_form_field( 'brnch' ).
  lv_s_stras   = request->get_form_field( 'stras' ).
  lv_s_max_str = request->get_form_field( 'max_rows' ).

  IF lv_s_max_str IS NOT INITIAL.
    lv_max_rows = CONV #( lv_s_max_str ).
  ENDIF.
  IF lv_max_rows <= 0 OR lv_max_rows > 500.
    lv_max_rows = 500.
  ENDIF.

  IF lv_s_banks IS INITIAL.
    lv_s_banks = 'ID'.
  ENDIF.
  TRANSLATE lv_s_banks TO UPPER CASE.
  TRANSLATE lv_s_bankk TO UPPER CASE.
  TRANSLATE lv_s_swift TO UPPER CASE.

  TYPES: BEGIN OF ty_bnka_res_item,
           banks TYPE bnka-banks,
           bankl TYPE bnka-bankl,
           banka TYPE bnka-banka,
           ort01 TYPE bnka-ort01,
           bnklz TYPE bnka-bnklz,
           swift TYPE bnka-swift,
           brnch TYPE bnka-brnch,
           stras TYPE bnka-stras,
         END OF ty_bnka_res_item.

  DATA: lt_bnka_res TYPE STANDARD TABLE OF ty_bnka_res_item,
        ls_bnka_res TYPE ty_bnka_res_item.

  DATA: lv_p_banks TYPE string,
        lv_p_bankl TYPE string,
        lv_p_banka TYPE string,
        lv_p_ort01 TYPE string,
        lv_p_bnklz TYPE string,
        lv_p_swift TYPE string,
        lv_p_brnch TYPE string,
        lv_p_stras TYPE string.

  lv_p_banks = lv_s_banks.
  IF lv_s_bankk IS NOT INITIAL.
    lv_p_bankl = |%{ lv_s_bankk }%|.
  ELSE.
    lv_p_bankl = '%'.
  ENDIF.

  IF lv_s_banka IS NOT INITIAL.
    lv_p_banka = |%{ lv_s_banka }%|.
  ELSE.
    lv_p_banka = '%'.
  ENDIF.

  IF lv_s_ort01 IS NOT INITIAL.
    lv_p_ort01 = |%{ lv_s_ort01 }%|.
  ELSE.
    lv_p_ort01 = '%'.
  ENDIF.

  IF lv_s_bnklz IS NOT INITIAL.
    lv_p_bnklz = |%{ lv_s_bnklz }%|.
  ELSE.
    lv_p_bnklz = '%'.
  ENDIF.

  IF lv_s_swift IS NOT INITIAL.
    lv_p_swift = |%{ lv_s_swift }%|.
  ELSE.
    lv_p_swift = '%'.
  ENDIF.

  IF lv_s_brnch IS NOT INITIAL.
    lv_p_brnch = |%{ lv_s_brnch }%|.
  ELSE.
    lv_p_brnch = '%'.
  ENDIF.

  IF lv_s_stras IS NOT INITIAL.
    lv_p_stras = |%{ lv_s_stras }%|.
  ELSE.
    lv_p_stras = '%'.
  ENDIF.

  SELECT banks, bankl, banka, ort01, bnklz, swift, brnch, stras
    FROM bnka
   WHERE banks = @lv_p_banks
     AND bankl LIKE @lv_p_bankl
     AND banka LIKE @lv_p_banka
     AND ort01 LIKE @lv_p_ort01
     AND bnklz LIKE @lv_p_bnklz
     AND swift LIKE @lv_p_swift
     AND brnch LIKE @lv_p_brnch
     AND stras LIKE @lv_p_stras
   ORDER BY banks, bankl
    INTO CORRESPONDING FIELDS OF TABLE @lt_bnka_res
   UP TO @lv_max_rows ROWS.

  DATA: lv_res_json TYPE string.
  TRY.
      lv_res_json = /ui2/cl_json=>serialize(
        data        = lt_bnka_res
        compress    = abap_true
        pretty_name = /ui2/cl_json=>pretty_mode-low_case ).
    CATCH cx_root.
      DATA: lv_items_json TYPE string,
            lv_esc_a      TYPE string,
            lv_esc_o      TYPE string,
            lv_esc_s      TYPE string,
            lv_esc_b      TYPE string,
            lv_esc_st     TYPE string.
      LOOP AT lt_bnka_res INTO ls_bnka_res.
        lv_esc_a  = ls_bnka_res-banka.
        REPLACE ALL OCCURRENCES OF '"' IN lv_esc_a WITH '\"'.
        lv_esc_o  = ls_bnka_res-ort01.
        REPLACE ALL OCCURRENCES OF '"' IN lv_esc_o WITH '\"'.
        lv_esc_s  = ls_bnka_res-swift.
        REPLACE ALL OCCURRENCES OF '"' IN lv_esc_s WITH '\"'.
        lv_esc_b  = ls_bnka_res-brnch.
        REPLACE ALL OCCURRENCES OF '"' IN lv_esc_b WITH '\"'.
        lv_esc_st = ls_bnka_res-stras.
        REPLACE ALL OCCURRENCES OF '"' IN lv_esc_st WITH '\"'.

        IF lv_items_json IS NOT INITIAL.
          lv_items_json = lv_items_json && ','.
        ENDIF.
        lv_items_json = lv_items_json &&
          |\{"banks":"{ ls_bnka_res-banks }","bankl":"{ ls_bnka_res-bankl }",|
          && |"banka":"{ lv_esc_a }","ort01":"{ lv_esc_o }",|
          && |"bnklz":"{ ls_bnka_res-bnklz }","swift":"{ lv_esc_s }",|
          && |"brnch":"{ lv_esc_b }","stras":"{ lv_esc_st }"\}|.
      ENDLOOP.
      lv_res_json = |[{ lv_items_json }]|.
  ENDTRY.

  DATA: lv_resp_full TYPE string.
  lv_resp_full = |\{"status":"SUCCESS","count":{ lines( lt_bnka_res ) },"data":{ lv_res_json }\}|.

  _m_response->set_content_type( 'application/json' ).
  _m_response->set_cdata( lv_resp_full ).
  _m_navigation->response_complete( ).
  RETURN.
ENDIF.

" ----------------------------------------------------------------------
" 0B. INTERCEPT GET_UPLOAD_DETAIL (Detail Dokumen Lampiran Staging)
" ----------------------------------------------------------------------
IF lv_init_action = 'GET_UPLOAD_DETAIL'.
  DATA: lv_g_req_no TYPE string.
  lv_g_req_no = request->get_form_field( 'REQ_NO' ).
  IF lv_g_req_no IS INITIAL.
    lv_g_req_no = request->get_form_field( 'REQ_ID' ).
  ENDIF.
  IF lv_g_req_no IS INITIAL.
    lv_g_req_no = request->get_form_field( 'req_id' ).
  ENDIF.

  TYPES: BEGIN OF ty_bp_doc_json_v,
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
         END OF ty_bp_doc_json_v.

  TYPES: BEGIN OF ty_bp_det_wrap_v,
           status      TYPE string,
           message     TYPE string,
           data        TYPE zmdg_bp_req,
           attachments TYPE TABLE OF ty_bp_doc_json_v WITH DEFAULT KEY,
         END OF ty_bp_det_wrap_v.

  DATA: ls_bp_wrap_v  TYPE ty_bp_det_wrap_v,
        ls_bp_db_v    TYPE zmdg_bp_req,
        lt_dms_db_v   TYPE TABLE OF ztb_bp_dms_doc,
        ls_dms_db_v   TYPE ztb_bp_dms_doc,
        lt_att_db_v   TYPE TABLE OF zmdg_req_att,
        ls_att_db_v   TYPE zmdg_req_att,
        lt_dms_json_v TYPE TABLE OF ty_bp_doc_json_v,
        ls_dms_json_v TYPE ty_bp_doc_json_v,
        lv_b64_f_v    TYPE string,
        lv_mtype_v    TYPE string,
        lv_tabix_v    TYPE i,
        lv_json_det_v TYPE string.

  CLEAR: lt_dms_db_v, lt_att_db_v, lt_dms_json_v, ls_bp_wrap_v, ls_bp_db_v.

  SELECT SINGLE * FROM zmdg_bp_req INTO @ls_bp_db_v WHERE req_id = @lv_g_req_no.
  SELECT * FROM ztb_bp_dms_doc INTO TABLE @lt_dms_db_v
    WHERE req_id = @lv_g_req_no ORDER BY doc_id ASCENDING.
  SELECT * FROM zmdg_req_att INTO TABLE @lt_att_db_v
    WHERE req_no = @lv_g_req_no ORDER BY att_no ASCENDING.

  IF lt_dms_db_v IS NOT INITIAL.
    LOOP AT lt_dms_db_v INTO ls_dms_db_v.
      lv_tabix_v = sy-tabix.
      CLEAR: ls_dms_json_v, lv_b64_f_v, ls_att_db_v, lv_mtype_v.
      ls_dms_json_v-doc_id        = CONV #( ls_dms_db_v-doc_id ).
      ls_dms_json_v-req_id        = CONV #( ls_dms_db_v-req_id ).
      ls_dms_json_v-file_name     = CONV #( ls_dms_db_v-file_name ).
      ls_dms_json_v-file_type     = CONV #( ls_dms_db_v-file_type ).
      ls_dms_json_v-mime_type     = CONV #( ls_dms_db_v-mime_type ).
      ls_dms_json_v-file_desc     = CONV #( ls_dms_db_v-file_desc ).
      ls_dms_json_v-file_size     = ls_dms_db_v-file_size.
      ls_dms_json_v-file_uri      = ls_dms_db_v-file_uri.
      ls_dms_json_v-dokar         = CONV #( ls_dms_db_v-dokar ).
      ls_dms_json_v-storage_cat   = CONV #( ls_dms_db_v-storage_cat ).
      ls_dms_json_v-dms_sync_stat = CONV #( ls_dms_db_v-dms_sync_stat ).
      ls_dms_json_v-stream_url    = |?action=STREAM_DOC&REQ_NO={ lv_g_req_no }&DOC_ID={ ls_dms_db_v-doc_id }&ATT_NO={ lv_tabix_v }|.

      READ TABLE lt_att_db_v INTO ls_att_db_v
        WITH KEY file_name = ls_dms_db_v-file_name.
      IF sy-subrc <> 0.
        READ TABLE lt_att_db_v INTO ls_att_db_v INDEX lv_tabix_v.
      ENDIF.

      IF sy-subrc = 0 AND ls_att_db_v-file_data IS NOT INITIAL.
        TRY.
            lv_b64_f_v = cl_http_utility=>encode_x_base64(
              unencoded = ls_att_db_v-file_data
            ).
            ls_dms_json_v-file_base64 = lv_b64_f_v.
            lv_mtype_v = ls_dms_json_v-mime_type.
            IF lv_mtype_v IS INITIAL OR lv_mtype_v NA '/'.
              IF ls_dms_json_v-file_type = 'PDF'.
                lv_mtype_v = 'application/pdf'.
              ELSE.
                lv_mtype_v = |image/{ to_lower( ls_dms_json_v-file_type ) }|.
              ENDIF.
            ENDIF.
            ls_dms_json_v-file_uri = |data:{ lv_mtype_v };base64,{ lv_b64_f_v }|.
          CATCH cx_root.
            CLEAR ls_dms_json_v-file_base64.
        ENDTRY.
      ELSE.
        IF strlen( ls_dms_db_v-file_uri ) > 0 AND strlen( ls_dms_db_v-file_uri ) <= 255.
          ls_dms_json_v-is_truncated = abap_true.
          CLEAR ls_dms_json_v-stream_url.
        ELSEIF ls_dms_db_v-file_size > 255 AND strlen( ls_dms_db_v-file_uri ) <= 255.
          ls_dms_json_v-is_truncated = abap_true.
          CLEAR ls_dms_json_v-stream_url.
        ENDIF.
      ENDIF.

      APPEND ls_dms_json_v TO lt_dms_json_v.
    ENDLOOP.
  ELSEIF lt_att_db_v IS NOT INITIAL.
    LOOP AT lt_att_db_v INTO ls_att_db_v.
      CLEAR: ls_dms_json_v, lv_b64_f_v, lv_mtype_v.
      ls_dms_json_v-doc_id    = |ATT_{ ls_att_db_v-att_no }|.
      ls_dms_json_v-req_id    = CONV #( ls_att_db_v-req_no ).
      ls_dms_json_v-file_name = CONV #( ls_att_db_v-file_name ).
      ls_dms_json_v-file_type = CONV #( ls_att_db_v-file_type ).
      ls_dms_json_v-file_desc = CONV #( ls_att_db_v-description ).
      ls_dms_json_v-file_size = ls_att_db_v-file_size.
      ls_dms_json_v-dokar     = 'ZMD'.
      ls_dms_json_v-stream_url = |?action=STREAM_DOC&REQ_NO={ lv_g_req_no }&ATT_NO={ ls_att_db_v-att_no }|.

      lv_mtype_v = ls_att_db_v-file_type.
      IF lv_mtype_v IS INITIAL OR lv_mtype_v NA '/'.
        IF ls_att_db_v-file_type = 'PDF'.
          lv_mtype_v = 'application/pdf'.
        ELSE.
          lv_mtype_v = |image/{ to_lower( ls_att_db_v-file_type ) }|.
        ENDIF.
      ENDIF.
      ls_dms_json_v-mime_type = lv_mtype_v.

      IF ls_att_db_v-file_data IS NOT INITIAL.
        TRY.
            lv_b64_f_v = cl_http_utility=>encode_x_base64(
              unencoded = ls_att_db_v-file_data
            ).
            ls_dms_json_v-file_base64 = lv_b64_f_v.
            ls_dms_json_v-file_uri = |data:{ lv_mtype_v };base64,{ lv_b64_f_v }|.
          CATCH cx_root.
            CLEAR ls_dms_json_v-file_base64.
        ENDTRY.
      ENDIF.

      APPEND ls_dms_json_v TO lt_dms_json_v.
    ENDLOOP.
  ENDIF.

  IF ls_bp_db_v-req_id IS NOT INITIAL OR lt_dms_json_v IS NOT INITIAL.
    ls_bp_wrap_v-status      = 'SUCCESS'.
    ls_bp_wrap_v-message     = 'Data retrieved successfully'.
    ls_bp_wrap_v-data        = ls_bp_db_v.
    ls_bp_wrap_v-attachments = lt_dms_json_v.
  ELSE.
    ls_bp_wrap_v-status      = 'ERROR'.
    ls_bp_wrap_v-message     = |Request BP { lv_g_req_no } tidak ditemukan.|.
  ENDIF.

  lv_json_det_v = /ui2/cl_json=>serialize(
    data        = ls_bp_wrap_v
    compress    = 'X'
    pretty_name = /ui2/cl_json=>pretty_mode-low_case
  ).

  _m_response->set_content_type( 'application/json' ).
  _m_response->set_cdata( lv_json_det_v ).
  _m_navigation->response_complete( ).
  RETURN.
ENDIF.

" ----------------------------------------------------------------------
" 0C. INTERCEPT STREAM_DOC (Direct Binary Document Output)
" ----------------------------------------------------------------------
IF lv_init_action = 'STREAM_DOC' OR lv_init_action = 'GET_DOC_FILE' OR lv_init_action = 'DOWNLOAD_DOC'.
  DATA: lv_strm_req_no TYPE string,
        lv_strm_doc_id TYPE string,
        lv_strm_att_no TYPE i,
        lv_att_str_v   TYPE string.
  lv_strm_req_no = request->get_form_field( 'REQ_NO' ).
  IF lv_strm_req_no IS INITIAL.
    lv_strm_req_no = request->get_form_field( 'REQ_ID' ).
  ENDIF.
  IF lv_strm_req_no IS INITIAL.
    lv_strm_req_no = request->get_form_field( 'req_id' ).
  ENDIF.
  lv_strm_doc_id = request->get_form_field( 'DOC_ID' ).
  lv_att_str_v   = request->get_form_field( 'ATT_NO' ).
  IF lv_att_str_v IS NOT INITIAL AND lv_att_str_v CO '0123456789'.
    lv_strm_att_no = CONV #( lv_att_str_v ).
  ENDIF.

  DATA: ls_strm_att_v  TYPE zmdg_req_att,
        ls_strm_dms_v  TYPE ztb_bp_dms_doc,
        lv_strm_data_v TYPE xstring,
        lv_strm_mime_v TYPE string,
        lv_strm_fn_v   TYPE string.

  CLEAR: ls_strm_att_v, ls_strm_dms_v, lv_strm_data_v, lv_strm_mime_v, lv_strm_fn_v.

  IF lv_strm_doc_id IS NOT INITIAL.
    SELECT SINGLE * FROM ztb_bp_dms_doc INTO @ls_strm_dms_v
      WHERE req_id = @lv_strm_req_no AND doc_id = @lv_strm_doc_id.
  ENDIF.

  IF lv_strm_att_no > 0.
    SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att_v
      WHERE req_no = @lv_strm_req_no AND att_no = @lv_strm_att_no.
  ENDIF.
  IF ls_strm_att_v-file_data IS INITIAL AND ls_strm_dms_v-file_name IS NOT INITIAL.
    SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att_v
      WHERE req_no = @lv_strm_req_no AND file_name = @ls_strm_dms_v-file_name.
  ENDIF.
  IF ls_strm_att_v-file_data IS INITIAL AND lv_strm_doc_id IS NOT INITIAL.
    SELECT SINGLE * FROM zmdg_req_att INTO @ls_strm_att_v
      WHERE req_no = @lv_strm_req_no
        AND ( file_name = @lv_strm_doc_id OR description = @lv_strm_doc_id ).
  ENDIF.

  IF ls_strm_att_v-file_data IS NOT INITIAL.
    lv_strm_data_v = ls_strm_att_v-file_data.
    lv_strm_fn_v   = ls_strm_att_v-file_name.
    lv_strm_mime_v = ls_strm_att_v-file_type.
  ELSEIF ls_strm_dms_v-file_name IS NOT INITIAL.
    IF strlen( ls_strm_dms_v-file_uri ) > 255 AND ls_strm_dms_v-file_uri CS 'base64,'.
      lv_strm_fn_v   = ls_strm_dms_v-file_name.
      lv_strm_mime_v = ls_strm_dms_v-mime_type.
      SPLIT ls_strm_dms_v-file_uri AT 'base64,' INTO DATA(lv_pfx_s) DATA(lv_raw_s).
      TRY.
          lv_strm_data_v = cl_http_utility=>decode_x_base64( encoded = lv_raw_s ).
        CATCH cx_root.
          CLEAR lv_strm_data_v.
      ENDTRY.
    ENDIF.
  ENDIF.

  IF lv_strm_data_v IS NOT INITIAL.
    IF lv_strm_mime_v IS INITIAL OR lv_strm_mime_v NA '/'.
      DATA(lv_ext_check_v) = to_upper( lv_strm_fn_v ).
      IF lv_ext_check_v CP '*.PDF'.
        lv_strm_mime_v = 'application/pdf'.
      ELSEIF lv_ext_check_v CP '*.PNG'.
        lv_strm_mime_v = 'image/png'.
      ELSEIF lv_ext_check_v CP '*.JPG' OR lv_ext_check_v CP '*.JPEG'.
        lv_strm_mime_v = 'image/jpeg'.
      ELSEIF lv_ext_check_v CP '*.WEBP'.
        lv_strm_mime_v = 'image/webp'.
      ELSE.
        lv_strm_mime_v = 'application/octet-stream'.
      ENDIF.
    ENDIF.

    _m_response->set_header_field( name = 'Content-Type' value = lv_strm_mime_v ).
    _m_response->set_header_field(
      name  = 'Content-Disposition'
      value = |inline; filename="{ lv_strm_fn_v }"|
    ).
    _m_response->set_data( data = lv_strm_data_v ).
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
ENDIF.

" 1. Retrieve URL Request ID Parameter (jika membuka request sebelumnya)
gv_req_id = request->get_form_field( 'req_id' ).

" 2. Load Existing Request jika ID dikirim
IF gv_req_id IS NOT INITIAL.
  SELECT SINGLE *
    FROM zmdg_bp_req
    INTO CORRESPONDING FIELDS OF @wa_req
   WHERE req_id = @gv_req_id.

    IF sy-subrc = 0.
      " Load Dokumen Lampiran Staging ZTB_BP_DMS_DOC & ZMDG_REQ_ATT
      CLEAR gt_dms_docs.
      SELECT *
        FROM ztb_bp_dms_doc
       WHERE req_id = @gv_req_id
        INTO CORRESPONDING FIELDS OF TABLE @gt_dms_docs.

      DATA: lt_att_init TYPE STANDARD TABLE OF zmdg_req_att WITH DEFAULT KEY,
            ls_att_init TYPE zmdg_req_att,
            ls_dms_upd  TYPE ztb_bp_dms_doc.

      SELECT * FROM zmdg_req_att INTO TABLE @lt_att_init
        WHERE req_no = @gv_req_id ORDER BY att_no ASCENDING.

      IF lt_att_init IS NOT INITIAL.
        LOOP AT gt_dms_docs INTO ls_dms_upd.
          READ TABLE lt_att_init INTO ls_att_init
            WITH KEY file_name = ls_dms_upd-file_name.
          IF sy-subrc <> 0.
            READ TABLE lt_att_init INTO ls_att_init INDEX sy-tabix.
          ENDIF.
          IF sy-subrc = 0 AND ls_att_init-file_data IS NOT INITIAL.
            TRY.
                DATA(lv_b64_init) = cl_http_utility=>encode_x_base64(
                  unencoded = ls_att_init-file_data
                ).
                DATA(lv_m_init) = ls_dms_upd-mime_type.
                IF lv_m_init IS INITIAL OR lv_m_init NA '/'.
                  IF ls_dms_upd-file_type = 'PDF'.
                    lv_m_init = 'application/pdf'.
                  ELSE.
                    lv_m_init = |image/{ to_lower( ls_dms_upd-file_type ) }|.
                  ENDIF.
                ENDIF.
                ls_dms_upd-file_uri = |data:{ lv_m_init };base64,{ lv_b64_init }|.
                MODIFY gt_dms_docs FROM ls_dms_upd.
              CATCH cx_root.
            ENDTRY.
          ENDIF.
        ENDLOOP.
      ENDIF.
    ELSE.
      APPEND VALUE #(
        type    = 'E'
        message = |Request ID { gv_req_id } tidak ditemukan dalam database staging ZMDG_BP_REQ.|
      ) TO gt_messages.
    ENDIF.

ELSE.
  " 3. Initialize Default Staging Values untuk Permohonan Baru
  CLEAR wa_req.
  wa_req-bp_category = '2'.        " 2 = Organization
  wa_req-bp_role     = 'FLVN01'.   " Default: Vendor (FLVN01 & FLVN00)
  wa_req-country     = 'ID'.       " Default: Indonesia (ISO: ID)
  wa_req-city        = 'SIDOARJO'. " Default: SIDOARJO
  wa_req-postal_code = '61254'.    " Default: 61254 Sidoarjo
  wa_req-region      = '08'.       " Default: Jawa Timur
  wa_req-tax_type    = 'ID1'.      " Default: NPWP Indonesia
  wa_req-banks       = 'ID'.       " Default Bank: Indonesia
  wa_req-bukrs       = 'KMI'.      " Default Company Code: KMI (PT. Kayu Mebel Indonesia)
  wa_req-akont       = '21100000'. " Default Recon Account: 21100000 (Local Trade Payable)
  wa_req-zterm       = 'NT30'.     " Default Terms: NT30
  wa_req-waers       = 'USD'.      " Default Currency: USD
  wa_req-bu_group    = 'S002'.     " Default: S002 (Local Trade)
  wa_req-ekorg       = '1000'.     " Default Purchasing Org: 1000
  ASSIGN COMPONENT 'KALSK' OF STRUCTURE wa_req TO FIELD-SYMBOL(<lv_kalsk_init>).
  IF sy-subrc = 0.
    <lv_kalsk_init> = 'LP'.
  ENDIF.
  wa_req-webre       = 'X'.        " Default: GR-Based Inv. Verif
  wa_req-lebre       = 'X'.        " Default: Service-Based Inv. Verif
  wa_req-status      = 'DRAFT'.
  wa_req-created_by  = sy-uname.
  GET TIME STAMP FIELD wa_req-created_at.
ENDIF.

" 4. Load User Request History (Vendor requests only)
SELECT *
  FROM zmdg_bp_req
 WHERE created_by = @sy-uname
   AND ( bu_group LIKE 'S%' OR bp_role LIKE 'FLVN%' OR bu_group = '' )
  ORDER BY created_at DESCENDING
  INTO CORRESPONDING FIELDS OF TABLE @gt_my_requests
 UP TO 100 ROWS.

" 5. Populate BP Roles Dropdown langsung dari tabel standar SAP TB003 & TB003T
CLEAR: gt_bp_roles, gt_roles.
SELECT a~role, b~rltxt
  FROM tb003 AS a
 INNER JOIN tb003t AS b ON a~role = b~role
 WHERE b~spras = @sy-langu
 ORDER BY a~role
  INTO CORRESPONDING FIELDS OF TABLE @gt_bp_roles.

IF gt_bp_roles IS INITIAL.
  SELECT a~role, b~rltxt
    FROM tb003 AS a
   INNER JOIN tb003t AS b ON a~role = b~role
   WHERE b~spras = 'E'
   ORDER BY a~role
    INTO CORRESPONDING FIELDS OF TABLE @gt_bp_roles.
ENDIF.

IF gt_bp_roles IS INITIAL.
  APPEND VALUE #( role = 'FLVN01' rltxt = 'MM Supplier' )             TO gt_bp_roles.
  APPEND VALUE #( role = 'FLVN00' rltxt = 'FI Supplier' )             TO gt_bp_roles.
  APPEND VALUE #( role = 'FLCU01' rltxt = 'SD Customer' )             TO gt_bp_roles.
  APPEND VALUE #( role = 'FLCU00' rltxt = 'FI Customer' )             TO gt_bp_roles.
ENDIF.

DATA: ls_role_fill TYPE ty_bp_role.
LOOP AT gt_bp_roles INTO ls_role_fill.
  APPEND VALUE #(
    key   = ls_role_fill-role
    value = |{ ls_role_fill-role } - { ls_role_fill-rltxt }|
  ) TO gt_roles.
ENDLOOP.

" 6. Populate BP Grouping Dropdown langsung dari tabel standar SAP TB001 & TB002
CLEAR: gt_bp_grouping.
SELECT a~bu_group, b~txt40
  FROM tb001 AS a
 INNER JOIN tb002 AS b ON a~bu_group = b~bu_group
 WHERE b~spras = @sy-langu
   AND a~bu_group IN ( 'C001', 'C002', 'C003', 'S001', 'S002', 'S003', 'S004', 'S005' )
 ORDER BY a~bu_group
  INTO CORRESPONDING FIELDS OF TABLE @gt_bp_grouping.

IF gt_bp_grouping IS INITIAL.
  SELECT a~bu_group, b~txt40
    FROM tb001 AS a
   INNER JOIN tb002 AS b ON a~bu_group = b~bu_group
   WHERE b~spras = 'E'
     AND a~bu_group IN ( 'C001', 'C002', 'C003', 'S001', 'S002', 'S003', 'S004', 'S005' )
   ORDER BY a~bu_group
    INTO CORRESPONDING FIELDS OF TABLE @gt_bp_grouping.
ENDIF.

IF gt_bp_grouping IS INITIAL.
  APPEND VALUE #( bu_group = 'C001' txt40 = 'Export Customer' )  TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'C002' txt40 = 'Local Customer' )   TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'C003' txt40 = 'Employee Customer' ) TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'S001' txt40 = 'Import Trade' )      TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'S002' txt40 = 'Local Trade' )       TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'S003' txt40 = 'Leasing Trade' )     TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'S004' txt40 = 'Service Trade' )     TO gt_bp_grouping.
  APPEND VALUE #( bu_group = 'S005' txt40 = 'Service Non Trade' ) TO gt_bp_grouping.
ENDIF.

" 7. Query Countries langsung dari tabel standar SAP T005T
CLEAR: gt_countries.
SELECT land1, landx
  FROM t005t
 WHERE spras = @sy-langu
 ORDER BY landx
  INTO CORRESPONDING FIELDS OF TABLE @gt_countries.

IF gt_countries IS INITIAL.
  SELECT land1, landx
    FROM t005t
   WHERE spras = 'E'
   ORDER BY landx
    INTO CORRESPONDING FIELDS OF TABLE @gt_countries.
ENDIF.

IF gt_countries IS INITIAL.
  APPEND VALUE #( land1 = 'ID' landx = 'Indonesia' )     TO gt_countries.
  APPEND VALUE #( land1 = 'SG' landx = 'Singapore' )     TO gt_countries.
  APPEND VALUE #( land1 = 'MY' landx = 'Malaysia' )      TO gt_countries.
  APPEND VALUE #( land1 = 'JP' landx = 'Japan' )         TO gt_countries.
  APPEND VALUE #( land1 = 'US' landx = 'United States' ) TO gt_countries.
  APPEND VALUE #( land1 = 'DE' landx = 'Germany' )       TO gt_countries.
  APPEND VALUE #( land1 = 'CN' landx = 'China' )         TO gt_countries.
ENDIF.

" 7. Query Regions / Wilayah langsung dari tabel standar SAP T005U
CLEAR: gt_regions.
SELECT land1, bland, bezei
  FROM t005u
 WHERE spras = @sy-langu
 ORDER BY bezei
  INTO CORRESPONDING FIELDS OF TABLE @gt_regions.

IF gt_regions IS INITIAL.
  SELECT land1, bland, bezei
    FROM t005u
   WHERE spras = 'E'
   ORDER BY bezei
    INTO CORRESPONDING FIELDS OF TABLE @gt_regions.
ENDIF.

IF gt_regions IS INITIAL.
  APPEND VALUE #( land1 = 'ID' bland = '08' bezei = 'Jawa Timur' )       TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '01' bezei = 'DKI Jakarta' )      TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '02' bezei = 'Jawa Barat' )       TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '03' bezei = 'Jawa Tengah' )      TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '04' bezei = 'DI Yogyakarta' )    TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '06' bezei = 'Banten' )           TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '07' bezei = 'Bali' )             TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '09' bezei = 'Sumatera Selatan' ) TO gt_regions.
  APPEND VALUE #( land1 = 'ID' bland = '10' bezei = 'Sulawesi Selatan' ) TO gt_regions.
ENDIF.

" 8. Query Master Bahasa langsung dari tabel standar SAP T002T & T002
CLEAR: gt_languages.
SELECT a~spras, b~laiso, a~sptxt
  FROM t002t AS a
 INNER JOIN t002 AS b ON a~spras = b~spras
 WHERE a~sprsl = @sy-langu
 ORDER BY a~sptxt ASCENDING
  INTO CORRESPONDING FIELDS OF TABLE @gt_languages.

IF gt_languages IS INITIAL.
  SELECT a~spras, b~laiso, a~sptxt
    FROM t002t AS a
   INNER JOIN t002 AS b ON a~spras = b~spras
   WHERE a~sprsl = 'E'
   ORDER BY a~sptxt ASCENDING
    INTO CORRESPONDING FIELDS OF TABLE @gt_languages.
ENDIF.

IF gt_languages IS INITIAL.
  APPEND VALUE #( spras = 'I' laiso = 'ID' sptxt = 'Indonesian' ) TO gt_languages.
  APPEND VALUE #( spras = 'E' laiso = 'EN' sptxt = 'English' )    TO gt_languages.
  APPEND VALUE #( spras = 'D' laiso = 'DE' sptxt = 'German' )     TO gt_languages.
  APPEND VALUE #( spras = 'J' laiso = 'JA' sptxt = 'Japanese' )   TO gt_languages.
ENDIF.

DATA: ls_lang_init TYPE ty_language.
LOOP AT gt_languages INTO ls_lang_init.
  ls_lang_init-key   = ls_lang_init-laiso.
  ls_lang_init-value = |{ ls_lang_init-laiso } - { ls_lang_init-sptxt }|.
  MODIFY gt_languages FROM ls_lang_init.
ENDLOOP.

" 9. Query Company Codes langsung dari tabel standar SAP T001
CLEAR: gt_company_codes.
SELECT bukrs, butxt, waers, land1
  FROM t001
 ORDER BY bukrs
  INTO CORRESPONDING FIELDS OF TABLE @gt_company_codes.

READ TABLE gt_company_codes ASSIGNING FIELD-SYMBOL(<ls_kmi_init>)
  WITH KEY bukrs = 'KMI'.
IF sy-subrc = 0.
  <ls_kmi_init>-butxt = 'PT. Kayu Mebel Indonesia'.
  <ls_kmi_init>-waers = 'USD'.
ELSE.
  INSERT VALUE #( bukrs = 'KMI'
                  butxt = 'PT. Kayu Mebel Indonesia'
                  waers = 'USD'
                  land1 = 'ID' )
    INTO gt_company_codes INDEX 1.
ENDIF.

IF gt_company_codes IS INITIAL.
  APPEND VALUE #( bukrs = 'KMI'
                  butxt = 'PT. Kayu Mebel Indonesia'
                  waers = 'USD'
                  land1 = 'ID' ) TO gt_company_codes.
  APPEND VALUE #( bukrs = '1000'
                  butxt = 'Best Run PT'
                  waers = 'IDR'
                  land1 = 'ID' ) TO gt_company_codes.
  APPEND VALUE #( bukrs = '2000'
                  butxt = 'Manufacturing Plant Co'
                  waers = 'IDR'
                  land1 = 'ID' ) TO gt_company_codes.
ENDIF.

DATA: ls_cc_fill TYPE ty_company_code.
LOOP AT gt_company_codes INTO ls_cc_fill.
  ls_cc_fill-key   = ls_cc_fill-bukrs.
  ls_cc_fill-value = |{ ls_cc_fill-bukrs } - { ls_cc_fill-butxt }|.
  MODIFY gt_company_codes FROM ls_cc_fill.
ENDLOOP.

" 10. Query Reconciliation Accounts (Hutang Vendor) dari SKB1 & SKAT
CLEAR: gt_recon_accounts.
SELECT a~bukrs, a~saknr, b~txt50
  FROM skb1 AS a
 INNER JOIN skat AS b ON a~saknr = b~saknr
 WHERE a~mitkz = 'K'
   AND b~spras = @sy-langu
 ORDER BY a~saknr
  INTO CORRESPONDING FIELDS OF TABLE @gt_recon_accounts.

IF gt_recon_accounts IS INITIAL.
  SELECT a~bukrs, a~saknr, b~txt50
    FROM skb1 AS a
   INNER JOIN skat AS b ON a~saknr = b~saknr
   WHERE a~mitkz = 'K'
     AND b~spras = 'E'
   ORDER BY a~saknr
    INTO CORRESPONDING FIELDS OF TABLE @gt_recon_accounts.
ENDIF.

" Konfigurasi akun rekonsiliasi Hutang Dagang (Local Trade Payable) untuk KMI
READ TABLE gt_recon_accounts WITH KEY bukrs = 'KMI' TRANSPORTING NO FIELDS.
IF sy-subrc <> 0.
  INSERT VALUE #( bukrs = 'KMI' saknr = '21100000'
                  txt50 = 'Local Trade Payable' )
    INTO gt_recon_accounts INDEX 1.
  APPEND VALUE #( bukrs = 'KMI' saknr = '21100001'
                  txt50 = 'Import Trade Payable' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = 'KMI' saknr = '21100002'
                  txt50 = 'Service Payable' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = 'KMI' saknr = '21100003'
                  txt50 = 'Intercompany Payable' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = 'KMI' saknr = '20200000'
                  txt50 = 'Down Payment Vendor' )
    TO gt_recon_accounts.
ENDIF.

READ TABLE gt_recon_accounts WITH KEY bukrs = '1000' TRANSPORTING NO FIELDS.
IF sy-subrc <> 0.
  APPEND VALUE #( bukrs = '1000' saknr = '21100000'
                  txt50 = 'Hutang Usaha Lokal / Trade Payables' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = '1000' saknr = '21100001'
                  txt50 = 'Hutang Usaha Impor / Import Payables' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = '1000' saknr = '21100002'
                  txt50 = 'Hutang Jasa / Service Payables' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = '1000' saknr = '21100003'
                  txt50 = 'Hutang Afiliasi / Intercompany Payables' )
    TO gt_recon_accounts.
  APPEND VALUE #( bukrs = '1000' saknr = '20200000'
                  txt50 = 'Uang Muka Vendor / Down Payment Vendor' )
    TO gt_recon_accounts.
ENDIF.

DATA: ls_ak_fill TYPE ty_recon_account.
LOOP AT gt_recon_accounts INTO ls_ak_fill.
  ls_ak_fill-key   = ls_ak_fill-saknr.
  ls_ak_fill-value = |{ ls_ak_fill-saknr } - { ls_ak_fill-txt50 }|.
  MODIFY gt_recon_accounts FROM ls_ak_fill.
ENDLOOP.

