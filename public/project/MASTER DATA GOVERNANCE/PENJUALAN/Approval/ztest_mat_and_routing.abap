*&---------------------------------------------------------------------*
*& Program      : ZTEST_MAT_AND_ROUTING
*& Description  : Eksekusi Berantai BAPI_MATERIAL_SAVEDATA &
*&                BAPI_ROUTING_CREATE untuk Produk Decking Corridor
*& Standar      : SAP S/4HANA & ECC Best Practice (Line <= 120 chars)
*&---------------------------------------------------------------------*
REPORT ztest_mat_and_routing.

TABLES: mara, marc.

" -----------------------------------------------------------------------
" TIPE DATA & STRUKTUR PENAMPUNG
" -----------------------------------------------------------------------
TYPES: BEGIN OF ty_material_input,
         matnr TYPE matnr,
         maktx TYPE maktx,
         mtart TYPE mtart,
         matkl TYPE matkl,
         werks TYPE werks_d,
         lgort TYPE lgort_d,
         meins TYPE meins,
         groes TYPE groes,
       END OF ty_material_input.

TYPES: BEGIN OF ty_routing_op,
         vornr  TYPE vornr,
         arbpl  TYPE arbpl,
         steus  TYPE steus,
         ltxa1  TYPE ltxa1,
         bmsch  TYPE bmsch,
         meinh  TYPE meinh,
         vgw01  TYPE vgw01,
         vge01  TYPE vge01,
       END OF ty_routing_op.

" -----------------------------------------------------------------------
" VARIABEL GLOBAL BAPI MATERIAL MASTER
" -----------------------------------------------------------------------
DATA: ls_headdata            TYPE bapimathead,
      ls_clientdata          TYPE bapi_mara,
      ls_clientdatax         TYPE bapi_marax,
      ls_plantdata           TYPE bapi_marc,
      ls_plantdatax          TYPE bapi_marcx,
      ls_storagelocationdata TYPE bapi_mard,
      ls_storagelocationdatax TYPE bapi_mardx,
      ls_valuationdata       TYPE bapi_mbew,
      ls_valuationdatax      TYPE bapi_mbewx,
      lt_materialdesc        TYPE TABLE OF bapi_makt,
      ls_materialdesc        TYPE bapi_makt,
      lt_returnmes           TYPE TABLE OF bapi_matreturn2,
      ls_bapireturn          TYPE bapiret2.

" -----------------------------------------------------------------------
" VARIABEL GLOBAL BAPI ROUTING
" -----------------------------------------------------------------------
DATA: lt_task TYPE TABLE OF bapi1012_tsk_c,
      ls_task TYPE bapi1012_tsk_c,
      lt_mtk  TYPE TABLE OF bapi1012_mtk_c,
      ls_mtk  TYPE bapi1012_mtk_c,
      lt_opr  TYPE TABLE OF bapi1012_opr_c,
      ls_opr  TYPE bapi1012_opr_c,
      lt_rout_return TYPE TABLE OF bapiret2,
      ls_rout_return TYPE bapiret2,
      lv_group TYPE bapi1012_all-task_list_group,
      lv_group_counter TYPE bapi1012_all-group_counter.

" -----------------------------------------------------------------------
" PARAMETER SELEKSI CONTOH DATA
" -----------------------------------------------------------------------
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_matnr TYPE matnr DEFAULT '30014254',
              p_maktx TYPE maktx DEFAULT 'DECKING CORRIDOR MOCKUP',
              p_werks TYPE werks_d DEFAULT '1000',
              p_lgort TYPE lgort_d DEFAULT '1309',
              p_mtart TYPE mtart DEFAULT 'HALB',
              p_meins TYPE meins DEFAULT 'SET'.
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.

  WRITE: / '=== MEMULAI INTEGRASI BAPI MATERIAL & BAPI ROUTING ===', /.

  " ---------------------------------------------------------------------
  " LANGKAH 1: EKSEKUSI BAPI_MATERIAL_SAVEDATA
  " ---------------------------------------------------------------------
  WRITE: / '1. Eksekusi BAPI_MATERIAL_SAVEDATA untuk Material:', p_matnr.

  CLEAR: ls_headdata, ls_clientdata, ls_clientdatax,
         ls_plantdata, ls_plantdatax, ls_storagelocationdata,
         ls_storagelocationdatax, ls_valuationdata, ls_valuationdatax.
  REFRESH: lt_materialdesc, lt_returnmes.

  " Header Material
  ls_headdata-material   = p_matnr.
  ls_headdata-ind_sector = 'F'.
  ls_headdata-matl_type  = p_mtart.
  ls_headdata-basic_view = 'X'.
  ls_headdata-mrp_view   = 'X'.
  ls_headdata-storage_view = 'X'.
  ls_headdata-work_sched_view = 'X'.
  ls_headdata-account_view    = 'X'.

  " Basic Data (MARA)
  ls_clientdata-base_uom   = p_meins.
  ls_clientdata-matl_group = 'HSF004'.
  ls_clientdatax-base_uom   = 'X'.
  ls_clientdatax-matl_group = 'X'.

  " Description (MAKT)
  CLEAR ls_materialdesc.
  ls_materialdesc-langu   = sy-langu.
  ls_materialdesc-matl_desc = p_maktx.
  APPEND ls_materialdesc TO lt_materialdesc.

  " Plant Data (MARC)
  ls_plantdata-plant      = p_werks.
  ls_plantdata-mrp_type   = 'PD'.
  ls_plantdata-mrp_ctrl   = 'PJ1'.
  ls_plantdata-mrp_group  = 'ZGW1'.
  ls_plantdata-lotsizekey = 'EX'.
  ls_plantdata-proc_type  = 'E'.
  ls_plantdata-backflush  = '1'.
  ls_plantdata-schedgroup = '000'.
  ls_plantdata-availcheck = 'KP'.
  ls_plantdata-prod_sched = '000002'.

  ls_plantdatax-plant      = p_werks.
  ls_plantdatax-mrp_type   = 'X'.
  ls_plantdatax-mrp_ctrl   = 'X'.
  ls_plantdatax-mrp_group  = 'X'.
  ls_plantdatax-lotsizekey = 'X'.
  ls_plantdatax-proc_type  = 'X'.
  ls_plantdatax-backflush  = 'X'.
  ls_plantdatax-schedgroup = 'X'.
  ls_plantdatax-availcheck = 'X'.
  ls_plantdatax-prod_sched = 'X'.

  " Storage Location Data (MARD)
  ls_storagelocationdata-plant  = p_werks.
  ls_storagelocationdata-stge_loc = p_lgort.
  ls_storagelocationdatax-plant  = p_werks.
  ls_storagelocationdatax-stge_loc = 'X'.

  " Valuation Data (MBEW)
  ls_valuationdata-val_area = p_werks.
  ls_valuationdata-val_class = 'SF01'.
  ls_valuationdata-price_ctrl = 'S'.
  ls_valuationdatax-val_area = p_werks.
  ls_valuationdatax-val_class = 'X'.
  ls_valuationdatax-price_ctrl = 'X'.

  CALL FUNCTION 'BAPI_MATERIAL_SAVEDATA'
    EXPORTING
      headdata            = ls_headdata
      clientdata          = ls_clientdata
      clientdatax         = ls_clientdatax
      plantdata           = ls_plantdata
      plantdatax          = ls_plantdatax
      storagelocationdata = ls_storagelocationdata
      storagelocationdatax = ls_storagelocationdatax
      valuationdata       = ls_valuationdata
      valuationdatax      = ls_valuationdatax
    IMPORTING
      return              = ls_bapireturn
    TABLES
      materialdescription = lt_materialdesc
      returnmessages      = lt_returnmes.

  IF ls_bapireturn-type = 'E' OR ls_bapireturn-type = 'A'.
    WRITE: / '[ERROR] Pembuatan Material Master Gagal:', ls_bapireturn-message.
    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
    STOP.
  ELSE.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
      EXPORTING
        wait = 'X'.
    WRITE: / '[SUCCESS] Material Master Berhasil Disimpan/Diupdate:', p_matnr.
  ENDIF.

  " ---------------------------------------------------------------------
  " LANGKAH 2: EKSEKUSI BAPI_ROUTING_CREATE
  " ---------------------------------------------------------------------
  WRITE: / '2. Eksekusi BAPI_ROUTING_CREATE untuk Material:', p_matnr.

  REFRESH: lt_task, lt_mtk, lt_opr, lt_rout_return.
  CLEAR: ls_task, ls_mtk, ls_opr, lv_group, lv_group_counter.

  " 2A. Header Routing (Task)
  ls_task-task_list_usage    = '1'.        " Production
  ls_task-plant              = p_werks.
  ls_task-task_list_status   = '4'.        " Released (General)
  ls_task-description        = p_maktx.
  ls_task-lot_size_from      = 0.
  ls_task-lot_size_to        = 99999999.
  ls_task-task_measure_unit  = p_meins.
  ls_task-valid_from_date    = sy-datum.
  APPEND ls_task TO lt_task.

  " 2B. Material Allocation (Ikat Material ke Task List)
  DATA: lv_conv_matnr TYPE matnr.
  CALL FUNCTION 'CONVERSION_EXIT_MATN1_INPUT'
    EXPORTING
      input  = p_matnr
    IMPORTING
      output = lv_conv_matnr.

  ls_mtk-material           = lv_conv_matnr.
  ls_mtk-plant              = p_werks.
  ls_mtk-task_list_usage    = '1'.
  ls_mtk-valid_from_date    = sy-datum.
  APPEND ls_mtk TO lt_mtk.

  " 2C. Operasi Routing (Operations)
  " Sesuai Data Excel: Op 0010 - WC089 (OIL), Waktu: 180 MIN
  DATA: lv_unit_min TYPE t006-msehi.
  CALL FUNCTION 'CONVERSION_EXIT_CUNIT_INPUT'
    EXPORTING
      input          = 'MIN'
    IMPORTING
      output         = lv_unit_min
    EXCEPTIONS
      unit_not_found = 1
      OTHERS         = 2.
  IF sy-subrc <> 0.
    lv_unit_min = 'MIN'.
  ENDIF.

  ls_opr-operation_number       = '0010'.
  ls_opr-work_cntr              = 'WC089'.
  ls_opr-plant                  = p_werks.
  ls_opr-control_key            = 'ZP01'.
  ls_opr-description            = 'OIL'.
  ls_opr-base_quantity          = 1.
  ls_opr-operation_measure_unit = p_meins.
  ls_opr-denominator            = 1.
  ls_opr-numerator              = 1.
  ls_opr-valid_from_date        = sy-datum.

  " Standard Values (Activity 1 - 180 MIN)
  ls_opr-standard_value_01      = 180.
  ls_opr-standard_unit_01       = lv_unit_min.
  ls_opr-standard_value_02      = 180.
  ls_opr-standard_unit_02       = lv_unit_min.
  ls_opr-standard_value_03      = 180.
  ls_opr-standard_unit_03       = lv_unit_min.
  ls_opr-standard_value_04      = 180.
  ls_opr-standard_unit_04       = lv_unit_min.
  ls_opr-standard_value_05      = 180.
  ls_opr-standard_unit_05       = lv_unit_min.
  ls_opr-standard_value_06      = 180.
  ls_opr-standard_unit_06       = lv_unit_min.

  APPEND ls_opr TO lt_opr.

  " Panggil BAPI Routing Create
  CALL FUNCTION 'BAPI_ROUTING_CREATE'
    EXPORTING
      testrun                = ' '
    IMPORTING
      group                  = lv_group
      groupcounter           = lv_group_counter
    TABLES
      task                   = lt_task
      materialtaskallocation = lt_mtk
      operation              = lt_opr
      return                 = lt_rout_return.

  DATA: lv_rout_has_error TYPE sap_bool VALUE abap_false.
  LOOP AT lt_rout_return INTO ls_rout_return WHERE type = 'E' OR type = 'A'.
    lv_rout_has_error = abap_true.
    WRITE: / '[ERROR ROUTING]:', ls_rout_return-message.
  ENDLOOP.

  IF lv_rout_has_error = abap_true.
    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
    WRITE: / '[GAGAL] Routing gagal dibuat di SAP.'.
  ELSE.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
      EXPORTING
        wait = 'X'.
    WRITE: / '[SUCCESS] Routing Berhasil Terbentuk di SAP!'.
    WRITE: / 'Group Routing       :', lv_group.
    WRITE: / 'Group Counter (Alt) :', lv_group_counter.
  ENDIF.
