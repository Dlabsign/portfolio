*----------------------------------------------------------------------*
* Method Name : STAGINGMATERIALS_GET_ENTITYSET / STAGINGMATERIALSET_GET_ENTITYSET
* Class       : ZCL_ZMDG_MATERIAL_SRV_DPC_EXT
* Description : Mengambil data Staging Material Master (Header & Detail)
*               dan melakukan sanitasi tipe data Boolean (RGEKZ, XCHPF)
*----------------------------------------------------------------------*
METHOD stagingmaterials_get_entityset.

  " 1. Deklarasi filter clause dinamis dari OData Gateway ($filter)
  DATA: lv_osql_where TYPE string.

  TRY.
      IF io_tech_request_context IS BOUND.
        lv_osql_where = io_tech_request_context->get_osql_where_clause( ).
      ENDIF.
    CATCH cx_root.
      CLEAR lv_osql_where.
  ENDTRY.

  " 2. Query data Staging Material (Join Tabel ZMDG_REQ_DTL dan ZMDG_REQ_HDR)
  IF lv_osql_where IS NOT INITIAL.
    TRY.
        SELECT d~req_no,
               d~item_no,
               d~matnr_ext,
               d~matnr_ext AS matnr,
               d~bismt,
               d~maktx,
               d~mtart,
               d~mbrsh,
               d~matkl,
               d~meins,
               d~spart,
               d~mtpos_mara,
               d~ferth,
               d~zeinr,
               d~normt,
               d~groes,
               d~werks,
               d~lgort,
               d~vkorg,
               d~vtweg,
               d~dwerk,
               d~vrkme,
               d~herkl,
               d~taxkm,
               d~tatyp,
               d~mtpos,
               d~ktgrm,
               d~mvgr1,
               d~mvgr2,
               d~mvgr3,
               d~mvgr4,
               d~mvgr5,
               d~tragr,
               d~ladgr,
               d~magrv,
               d~xchpf,
               d~prctr,
               d~bklas,
               d~stprs,
               d~verpr,
               d~peinh,
               d~vprsv,
               d~laeng,
               d~breit,
               d~hoehe,
               d~meabm,
               d~brgew,
               d~gewei,
               d~ntgew,
               d~volum,
               d~ekgrp,
               d~voleh,
               d~dismm,
               d~disgr,
               d~dispo,
               d~disls,
               d~bstmi,
               d~bstma,
               d~bstrf,
               d~beskz,
               d~sobsl,
               d~rgekz,
               d~dzeit,
               d~plifz,
               d~webaz,
               d~fhori,
               d~eisbe,
               d~strgr,
               d~vrmod,
               d~vint1,
               d~vint2,
               d~mtvfp,
               d~altsl,
               d~kzkst,
               d~ausme,
               d~lgpro,
               d~mmsta,
               d~bwkey,
               h~status,
               h~requestor,
               h~req_date,
               h~req_time,
               h~remarks,
               h~sub_reason
          FROM zmdg_req_dtl AS d
          LEFT OUTER JOIN zmdg_req_hdr AS h
            ON h~req_no = d~req_no
          WHERE (lv_osql_where)
          ORDER BY d~req_no DESCENDING, d~item_no ASCENDING
          INTO CORRESPONDING FIELDS OF TABLE @et_entityset
          UP TO 5000 ROWS.
      CATCH cx_root.
        CLEAR et_entityset.
    ENDTRY.
  ENDIF.

  " Fallback jika klausa where dinamis kosong atau gagal dieksekusi
  IF et_entityset IS INITIAL.
    SELECT d~req_no,
           d~item_no,
           d~matnr_ext,
           d~matnr_ext AS matnr,
           d~bismt,
           d~maktx,
           d~mtart,
           d~mbrsh,
           d~matkl,
           d~meins,
           d~spart,
           d~mtpos_mara,
           d~ferth,
           d~zeinr,
           d~normt,
           d~groes,
           d~werks,
           d~lgort,
           d~vkorg,
           d~vtweg,
           d~dwerk,
           d~vrkme,
           d~herkl,
           d~taxkm,
           d~tatyp,
           d~mtpos,
           d~ktgrm,
           d~mvgr1,
           d~mvgr2,
           d~mvgr3,
           d~mvgr4,
           d~mvgr5,
           d~tragr,
           d~ladgr,
           d~magrv,
           d~xchpf,
           d~prctr,
           d~bklas,
           d~stprs,
           d~verpr,
           d~peinh,
           d~vprsv,
           d~laeng,
           d~breit,
           d~hoehe,
           d~meabm,
           d~brgew,
           d~gewei,
           d~ntgew,
           d~volum,
           d~ekgrp,
           d~voleh,
           d~dismm,
           d~disgr,
           d~dispo,
           d~disls,
           d~bstmi,
           d~bstma,
           d~bstrf,
           d~beskz,
           d~sobsl,
           d~rgekz,
           d~dzeit,
           d~plifz,
           d~webaz,
           d~fhori,
           d~eisbe,
           d~strgr,
           d~vrmod,
           d~vint1,
           d~vint2,
           d~mtvfp,
           d~altsl,
           d~kzkst,
           d~ausme,
           d~lgpro,
           d~mmsta,
           d~bwkey,
           h~status,
           h~requestor,
           h~req_date,
           h~req_time,
           h~remarks,
           h~sub_reason
      FROM zmdg_req_dtl AS d
      LEFT OUTER JOIN zmdg_req_hdr AS h
        ON h~req_no = d~req_no
      ORDER BY d~req_no DESCENDING, d~item_no ASCENDING
      INTO CORRESPONDING FIELDS OF TABLE @et_entityset
      UP TO 5000 ROWS.
  ENDIF.

  " 3. Sanitasi Tipe Data Boolean & Formatting (Pencegahan Runtime Error OData)
  LOOP AT et_entityset ASSIGNING FIELD-SYMBOL(<ls_entity>).

    " --- A. Sanitasi Field RGEKZ (Backflush Indicator) ---
    " Mencegah error 'Property Rgekz has invalid value 1' pada JSON/XML serializer
    ASSIGN COMPONENT 'RGEKZ' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_rgekz>).
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'Rgekz' OF STRUCTURE <ls_entity> TO <lv_rgekz>.
    ENDIF.
    IF sy-subrc = 0.
      IF <lv_rgekz> IS NOT INITIAL AND <lv_rgekz> <> '0' AND <lv_rgekz> <> abap_false.
        <lv_rgekz> = abap_true.   " Nilai 'X' (OData JSON True)
      ELSE.
        <lv_rgekz> = abap_false.  " Nilai ' ' (OData JSON False)
      ENDIF.
    ENDIF.

    " --- B. Sanitasi Field XCHPF (Batch Management Indicator) ---
    ASSIGN COMPONENT 'XCHPF' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_xchpf>).
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'Xchpf' OF STRUCTURE <ls_entity> TO <lv_xchpf>.
    ENDIF.
    IF sy-subrc = 0.
      IF <lv_xchpf> = 'X' OR <lv_xchpf> = 'x' OR <lv_xchpf> = '1'.
        <lv_xchpf> = abap_true.
      ELSE.
        <lv_xchpf> = abap_false.
      ENDIF.
    ENDIF.

    " --- C. Sanitasi Field MATERIAL_GUID / UUID ---
    ASSIGN COMPONENT 'MATERIAL_GUID' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_guid>).
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'MATERIALGUID' OF STRUCTURE <ls_entity> TO <lv_guid>.
    ENDIF.
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'MaterialGuid' OF STRUCTURE <ls_entity> TO <lv_guid>.
    ENDIF.
    IF sy-subrc = 0 AND <lv_guid> IS INITIAL.
      TRY.
          <lv_guid> = cl_system_uuid=>create_uuid_x16_static( ).
        CATCH cx_uuid_error.
          CLEAR <lv_guid>.
      ENDTRY.
    ENDIF.

    " --- D. Format Nomor Material (Hilangkan Leading Zeroes) ---
    ASSIGN COMPONENT 'MATNR' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_matnr>).
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'Matnr' OF STRUCTURE <ls_entity> TO <lv_matnr>.
    ENDIF.
    IF sy-subrc = 0 AND <lv_matnr> IS NOT INITIAL AND <lv_matnr> CO '0123456789 '.
      <lv_matnr> = |{ <lv_matnr> ALPHA = OUT }|.
    ENDIF.

  ENDLOOP.

ENDMETHOD.
