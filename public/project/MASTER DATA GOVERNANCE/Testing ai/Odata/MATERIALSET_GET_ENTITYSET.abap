*----------------------------------------------------------------------*
* Method Name : MATERIALSET_GET_ENTITYSET
* Class       : ZCL_ZMDG_MATERIAL_SRV_DPC_EXT
* Description : Mengambil data Master Material SAP secara dinamis
*               berdasarkan filter Matnr, Mtart, Matkl, Werks, dan Maktx.
*----------------------------------------------------------------------*
METHOD materialset_get_entityset.

  " 1. Deklarasi Range Tables untuk Kriteria Filter Dinamis
  DATA: lr_matnr TYPE RANGE OF mara-matnr,
        lr_mtart TYPE RANGE OF mara-mtart,
        lr_matkl TYPE RANGE OF mara-matkl,
        lr_werks TYPE RANGE OF marc-werks,
        lr_maktx TYPE RANGE OF makt-maktx.

  DATA: lt_filter_so TYPE /iwbep/t_mgw_select_option,
        ls_filter_so LIKE LINE OF lt_filter_so,
        ls_so        LIKE LINE OF ls_filter_so-select_options.

  DATA: lv_from_date TYPE mara-ersda,
        lv_use_date  TYPE abap_bool VALUE abap_false,
        lv_max_rows  TYPE int4 VALUE 5000.

  " 2. Ekstraksi Filter Select Options dari OData Gateway ($filter)
  IF io_tech_request_context IS BOUND.
    TRY.
        DATA(lo_filter) = io_tech_request_context->get_filter( ).
        IF lo_filter IS BOUND.
          lt_filter_so = lo_filter->get_filter_select_options( ).
        ENDIF.
      CATCH cx_root.
        CLEAR lt_filter_so.
    ENDTRY.

    DATA(lv_req_top) = io_tech_request_context->get_top( ).
    IF lv_req_top > 0 AND lv_req_top <= 10000.
      lv_max_rows = lv_req_top.
    ENDIF.
  ENDIF.

  IF lt_filter_so IS INITIAL.
    lt_filter_so = it_filter_select_options.
  ENDIF.

  " 3. Pemetaan Parameter Filter OData ke Range ABAP
  LOOP AT lt_filter_so INTO ls_filter_so.
    DATA(lv_prop) = to_upper( ls_filter_so-property ).

    CASE lv_prop.
      WHEN 'MATNR'.
        LOOP AT ls_filter_so-select_options INTO ls_so.
          DATA: ls_matnr_r LIKE LINE OF lr_matnr.
          ls_matnr_r-sign   = ls_so-sign.
          ls_matnr_r-option = ls_so-option.

          " Normalisasi format leading zeroes untuk nomor material numerik
          IF ls_so-low IS NOT INITIAL.
            IF ls_so-low CO '0123456789 '.
              ls_matnr_r-low = |{ ls_so-low ALPHA = IN }|.
            ELSE.
              ls_matnr_r-low = ls_so-low.
            ENDIF.
          ENDIF.

          IF ls_so-high IS NOT INITIAL.
            IF ls_so-high CO '0123456789 '.
              ls_matnr_r-high = |{ ls_so-high ALPHA = IN }|.
            ELSE.
              ls_matnr_r-high = ls_so-high.
            ENDIF.
          ENDIF.

          APPEND ls_matnr_r TO lr_matnr.

          " Sertakan juga nilai unpadded jika input berbeda dari hasil padding
          IF ls_so-low IS NOT INITIAL AND ls_so-low <> ls_matnr_r-low.
            ls_matnr_r-low = ls_so-low.
            CLEAR ls_matnr_r-high.
            APPEND ls_matnr_r TO lr_matnr.
          ENDIF.
        ENDLOOP.

      WHEN 'MTART'.
        LOOP AT ls_filter_so-select_options INTO ls_so.
          DATA: ls_mtart_r LIKE LINE OF lr_mtart.
          ls_mtart_r-sign   = ls_so-sign.
          ls_mtart_r-option = ls_so-option.
          ls_mtart_r-low    = to_upper( ls_so-low ).
          ls_mtart_r-high   = to_upper( ls_so-high ).
          APPEND ls_mtart_r TO lr_mtart.
        ENDLOOP.

      WHEN 'MATKL'.
        LOOP AT ls_filter_so-select_options INTO ls_so.
          DATA: ls_matkl_r LIKE LINE OF lr_matkl.
          ls_matkl_r-sign   = ls_so-sign.
          ls_matkl_r-option = ls_so-option.
          ls_matkl_r-low    = to_upper( ls_so-low ).
          ls_matkl_r-high   = to_upper( ls_so-high ).
          APPEND ls_matkl_r TO lr_matkl.
        ENDLOOP.

      WHEN 'WERKS'.
        LOOP AT ls_filter_so-select_options INTO ls_so.
          DATA: ls_werks_r LIKE LINE OF lr_werks.
          ls_werks_r-sign   = ls_so-sign.
          ls_werks_r-option = ls_so-option.
          ls_werks_r-low    = ls_so-low.
          ls_werks_r-high   = ls_so-high.
          APPEND ls_werks_r TO lr_werks.
        ENDLOOP.

      WHEN 'MAKTX'.
        LOOP AT ls_filter_so-select_options INTO ls_so.
          DATA: ls_maktx_r LIKE LINE OF lr_maktx.
          ls_maktx_r-sign   = ls_so-sign.
          ls_maktx_r-option = ls_so-option.
          ls_maktx_r-low    = ls_so-low.
          ls_maktx_r-high   = ls_so-high.
          APPEND ls_maktx_r TO lr_maktx.
        ENDLOOP.

    ENDCASE.
  ENDLOOP.

  " 4. Kebijakan Filter Tanggal: HANYA jika semua kriteria filter kosong
  IF lr_matnr IS INITIAL AND lr_mtart IS INITIAL AND
     lr_matkl IS INITIAL AND lr_werks IS INITIAL AND lr_maktx IS INITIAL.
    lv_use_date     = abap_true.
    lv_from_date    = sy-datum.
    lv_from_date(4) = lv_from_date(4) - 2. " Mundur 2 tahun untuk query tanpa filter
  ENDIF.

  " 5. Eksekusi Query Dinamis ke Database S/4HANA
  IF lr_werks IS NOT INITIAL.
    " Jika ada filter Plant, lakukan INNER JOIN ke MARC agar performan & presisi
    SELECT a~matnr,
           a~maktx,
           b~mbrsh,
           b~bismt,
           b~mtart,
           b~matkl,
           b~meins,
           b~spart,
           b~groes,
           b~wrkst,
           b~zeinr AS doknr,
           b~normt,
           b~xchpf,
           b~laeng,
           b~breit,
           b~hoehe,
           b~meabm,
           b~brgew,
           b~ntgew,
           b~gewei,
           b~volum,
           b~voleh,
           b~tragr,
           c~werks,
           c~ekgrp,
           c~dismm,
           c~disgr,
           c~dispo,
           c~disls,
           c~bstmi,
           c~bstma,
           c~bstrf,
           c~beskz,
           c~sobsl,
           c~rgekz,
           c~dzeit,
           c~plifz,
           c~webaz,
           c~fhori,
           c~eisbe,
           c~strgr,
           c~vrmod,
           c~vint1,
           c~vint2,
           c~mtvfp,
           c~altsl,
           c~sbdkz,
           c~ausme,
           c~lgpro,
           c~lgfsb,
           c~sfcpf AS sfadp,
           c~mmsta,
           c~prctr,
           d~lgort,
           e~vkorg,
           e~vtweg,
           e~vrkme,
           e~mtpos,
           e~ktgrm,
           e~mvgr1,
           e~mvgr2,
           e~mvgr3,
           f~bwkey,
           f~bklas,
           f~vprsv,
           f~stprs,
           f~verpr,
           f~peinh
      FROM makt AS a
      INNER JOIN mara AS b ON b~matnr = a~matnr
      INNER JOIN marc AS c ON c~matnr = a~matnr
      LEFT OUTER JOIN mard AS d ON d~matnr = c~matnr
                               AND d~werks = c~werks
      LEFT OUTER JOIN mvke AS e ON e~matnr = a~matnr
      LEFT OUTER JOIN mbew AS f ON f~matnr = a~matnr
                               AND f~bwkey = c~werks
      WHERE a~spras = @sy-langu
        AND a~matnr IN @lr_matnr
        AND b~mtart IN @lr_mtart
        AND b~matkl IN @lr_matkl
        AND c~werks IN @lr_werks
        AND a~maktx IN @lr_maktx
      INTO CORRESPONDING FIELDS OF TABLE @et_entityset
      UP TO @lv_max_rows ROWS.

  ELSE.
    " Jika filter Plant kosong, gunakan LEFT OUTER JOIN ke MARC
    SELECT a~matnr,
           a~maktx,
           b~mbrsh,
           b~bismt,
           b~mtart,
           b~matkl,
           b~meins,
           b~spart,
           b~groes,
           b~wrkst,
           b~zeinr AS doknr,
           b~normt,
           b~xchpf,
           b~laeng,
           b~breit,
           b~hoehe,
           b~meabm,
           b~brgew,
           b~ntgew,
           b~gewei,
           b~volum,
           b~voleh,
           b~tragr,
           c~werks,
           c~ekgrp,
           c~dismm,
           c~disgr,
           c~dispo,
           c~disls,
           c~bstmi,
           c~bstma,
           c~bstrf,
           c~beskz,
           c~sobsl,
           c~rgekz,
           c~dzeit,
           c~plifz,
           c~webaz,
           c~fhori,
           c~eisbe,
           c~strgr,
           c~vrmod,
           c~vint1,
           c~vint2,
           c~mtvfp,
           c~altsl,
           c~sbdkz,
           c~ausme,
           c~lgpro,
           c~lgfsb,
           c~sfcpf AS sfadp,
           c~mmsta,
           c~prctr,
           d~lgort,
           e~vkorg,
           e~vtweg,
           e~vrkme,
           e~mtpos,
           e~ktgrm,
           e~mvgr1,
           e~mvgr2,
           e~mvgr3,
           f~bwkey,
           f~bklas,
           f~vprsv,
           f~stprs,
           f~verpr,
           f~peinh
      FROM makt AS a
      INNER JOIN mara AS b ON b~matnr = a~matnr
      LEFT OUTER JOIN marc AS c ON c~matnr = a~matnr
      LEFT OUTER JOIN mard AS d ON d~matnr = c~matnr
                               AND d~werks = c~werks
      LEFT OUTER JOIN mvke AS e ON e~matnr = a~matnr
      LEFT OUTER JOIN mbew AS f ON f~matnr = a~matnr
                               AND f~bwkey = c~werks
      WHERE a~spras = @sy-langu
        AND a~matnr IN @lr_matnr
        AND b~mtart IN @lr_mtart
        AND b~matkl IN @lr_matkl
        AND a~maktx IN @lr_maktx
        AND ( @lv_use_date = @abap_false OR b~ersda >= @lv_from_date )
      INTO CORRESPONDING FIELDS OF TABLE @et_entityset
      UP TO @lv_max_rows ROWS.
  ENDIF.

  " 6. Eliminasi Duplikasi Baris (akibat Cartesian Join multi-lokasi)
  SORT et_entityset BY ('MATNR') ('WERKS') ('LGORT').
  DELETE ADJACENT DUPLICATES FROM et_entityset
    COMPARING ('MATNR') ('WERKS') ('LGORT').

  " 7. Sanitasi Nilai Boolean, MaterialGuid, dan Format MATNR
  LOOP AT et_entityset ASSIGNING FIELD-SYMBOL(<ls_entity>).

    " Format nomor material tanpa leading zeroes untuk tampilan bersih
    ASSIGN COMPONENT 'MATNR' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_matnr>).
    IF sy-subrc = 0 AND <lv_matnr> IS NOT INITIAL.
      <lv_matnr> = |{ <lv_matnr> ALPHA = OUT }|.
    ENDIF.

    " Konversi nilai boolean RGEKZ
    ASSIGN COMPONENT 'RGEKZ' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_rgekz>).
    IF sy-subrc = 0.
      IF <lv_rgekz> IS NOT INITIAL AND <lv_rgekz> <> '0' AND <lv_rgekz> <> ' '.
        <lv_rgekz> = abap_true.
      ELSE.
        <lv_rgekz> = abap_false.
      ENDIF.
    ENDIF.

    " Konversi nilai boolean XCHPF
    ASSIGN COMPONENT 'XCHPF' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_xchpf>).
    IF sy-subrc = 0.
      IF <lv_xchpf> IS NOT INITIAL AND <lv_xchpf> <> '0' AND <lv_xchpf> <> ' '.
        <lv_xchpf> = abap_true.
      ELSE.
        <lv_xchpf> = abap_false.
      ENDIF.
    ENDIF.

    " Pengaman MaterialGuid agar tidak error jika kosong
    ASSIGN COMPONENT 'MATERIAL_GUID' OF STRUCTURE <ls_entity> TO FIELD-SYMBOL(<lv_guid>).
    IF sy-subrc <> 0.
      ASSIGN COMPONENT 'MATERIALGUID' OF STRUCTURE <ls_entity> TO <lv_guid>.
    ENDIF.

    IF sy-subrc = 0 AND <lv_guid> IS INITIAL.
      TRY.
          <lv_guid> = cl_system_uuid=>create_uuid_x16_static( ).
        CATCH cx_uuid_error.
      ENDTRY.
    ENDIF.

  ENDLOOP.

ENDMETHOD.
