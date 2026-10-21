*&---------------------------------------------------------------------*
*& Program      : ZTEST_AUTO_ROUTING_MULTI
*& Description  : Otomasi Pembuatan Multi-Level Routing SAP dari BOM
*&                (Level 0: Header, Level 1: PF, Level 2: SF)
*& Standar      : SAP S/4HANA & ECC Best Practice (Line <= 120 chars)
*&---------------------------------------------------------------------*
REPORT ztest_auto_routing_multi.

TABLES: mara, marc.

" -----------------------------------------------------------------------
" DEFINISI TIPE DATA
" -----------------------------------------------------------------------
TYPES: BEGIN OF ty_bom_component,
         item_no   TYPE numc4,
         part_type TYPE char2,       " PF = Part Finish, SF = Core Mld
         matnr     TYPE matnr,       " Kode Part (1, 2, 3...)
         maktx     TYPE maktx,       " Deskripsi Part
         dim_t     TYPE i,           " Tebal (mm)
         dim_w     TYPE i,           " Lebar (mm)
         dim_l     TYPE i,           " Panjang (mm)
         qty       TYPE menge_d,
         meins     TYPE meins,
         sloc_prod TYPE lgort_d,
         note      TYPE char50,
       END OF ty_bom_component.

TYPES: BEGIN OF ty_log_routing,
         level         TYPE char25,
         matnr         TYPE matnr,
         maktx         TYPE maktx,
         vornr         TYPE vornr,
         arbpl         TYPE arbpl,
         ltxa1         TYPE ltxa1,
         duration      TYPE i,
         unit          TYPE meinh,
         formula_note  TYPE string,
         group         TYPE bapi1012_all-task_list_group,
         group_counter TYPE bapi1012_all-group_counter,
         status        TYPE char10,
         message       TYPE string,
       END OF ty_log_routing.

" -----------------------------------------------------------------------
" VARIABEL GLOBAL
" -----------------------------------------------------------------------
DATA: lt_components TYPE TABLE OF ty_bom_component,
      ls_comp       TYPE ty_bom_component,
      lt_log        TYPE TABLE OF ty_log_routing,
      ls_log        TYPE ty_log_routing.

DATA: lt_task        TYPE TABLE OF bapi1012_tsk_c,
      ls_task        TYPE bapi1012_tsk_c,
      lt_mtk         TYPE TABLE OF bapi1012_mtk_c,
      ls_mtk         TYPE bapi1012_mtk_c,
      lt_opr         TYPE TABLE OF bapi1012_opr_c,
      ls_opr         TYPE bapi1012_opr_c,
      lt_rout_return TYPE TABLE OF bapiret2,
      ls_rout_return TYPE bapiret2,
      lv_group       TYPE bapi1012_all-task_list_group,
      lv_group_ctr   TYPE bapi1012_all-group_counter.

" -----------------------------------------------------------------------
" PARAMETER SELEKSI
" -----------------------------------------------------------------------
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.
  PARAMETERS: p_matnr TYPE matnr   DEFAULT '30014254',
              p_maktx TYPE maktx   DEFAULT 'DECKING CORRIDOR MOCKUP',
              p_werks TYPE werks_d DEFAULT '1000',
              p_paint TYPE i       DEFAULT 180. " Menit Finishing Sealer
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-002.
  PARAMETERS: p_prev RADIOBUTTON GROUP r1 DEFAULT 'X', " 1. Preview & Hitung Saja (Aman 100%)
              p_simu RADIOBUTTON GROUP r1,             " 2. Uji BAPI (Test Run + Rollback)
              p_exec RADIOBUTTON GROUP r1.             " 3. Eksekusi Nyata ke SAP (Commit)
SELECTION-SCREEN END OF BLOCK b2.

" -----------------------------------------------------------------------
" EVENT UTAMA
" -----------------------------------------------------------------------
START-OF-SELECTION.

  PERFORM f_init_bom_data.
  PERFORM f_process_header_routing.
  PERFORM f_process_component_routings.
  PERFORM f_display_results.

*&---------------------------------------------------------------------*
*& Form f_init_bom_data
*&---------------------------------------------------------------------*
FORM f_init_bom_data.
  REFRESH lt_components.

  " Level 1 & Level 2 Data Komponen Kayu (Sesuai BOM Material)
  " JOYSTICK CORRIDOR
  ls_comp-item_no   = '0010'.
  ls_comp-part_type = 'PF'.
  ls_comp-matnr     = '1'.
  ls_comp-maktx     = 'COMP 2 JOYSTICK CORRIDOR DC CORRIDOR MU'.
  ls_comp-dim_t     = 50.
  ls_comp-dim_w     = 70.
  ls_comp-dim_l     = 1750.
  ls_comp-qty       = 26.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1307'.
  ls_comp-note      = 'Ada Grooving U/ Decking'.
  APPEND ls_comp TO lt_components.

  ls_comp-item_no   = '0020'.
  ls_comp-part_type = 'SF'.
  ls_comp-matnr     = '2'.
  ls_comp-maktx     = 'PART CORE MLD JOYSTICK CORRIDOR DC CORRIDOR MU'.
  ls_comp-dim_t     = 52.
  ls_comp-dim_w     = 75.
  ls_comp-dim_l     = 1760.
  ls_comp-qty       = 26.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1E04'.
  ls_comp-note      = 'Rough Size Core Moulding'.
  APPEND ls_comp TO lt_components.

  " SOLID A
  ls_comp-item_no   = '0030'.
  ls_comp-part_type = 'PF'.
  ls_comp-matnr     = '3'.
  ls_comp-maktx     = 'COMP 2 SOLID A DC CORRIDOR MU'.
  ls_comp-dim_t     = 28.
  ls_comp-dim_w     = 55.
  ls_comp-dim_l     = 14000.
  ls_comp-qty       = 5.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1307'.
  ls_comp-note      = 'Finish Presisi'.
  APPEND ls_comp TO lt_components.

  ls_comp-item_no   = '0040'.
  ls_comp-part_type = 'SF'.
  ls_comp-matnr     = '4'.
  ls_comp-maktx     = 'PART CORE MLD SOLID A DC CORRIDOR MU'.
  ls_comp-dim_t     = 30.
  ls_comp-dim_w     = 60.
  ls_comp-dim_l     = 14010.
  ls_comp-qty       = 5.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1E04'.
  ls_comp-note      = 'Rough Size Core Moulding'.
  APPEND ls_comp TO lt_components.

  " SOLID B
  ls_comp-item_no   = '0050'.
  ls_comp-part_type = 'PF'.
  ls_comp-matnr     = '5'.
  ls_comp-maktx     = 'COMP 2 SOLID B DC CORRIDOR MU'.
  ls_comp-dim_t     = 28.
  ls_comp-dim_w     = 85.
  ls_comp-dim_l     = 14000.
  ls_comp-qty       = 8.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1307'.
  ls_comp-note      = 'Finish Presisi'.
  APPEND ls_comp TO lt_components.

  ls_comp-item_no   = '0060'.
  ls_comp-part_type = 'SF'.
  ls_comp-matnr     = '6'.
  ls_comp-maktx     = 'PART CORE MLD SOLID B DC CORRIDOR MU'.
  ls_comp-dim_t     = 30.
  ls_comp-dim_w     = 90.
  ls_comp-dim_l     = 14010.
  ls_comp-qty       = 8.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1E04'.
  ls_comp-note      = 'Rough Size Core Moulding'.
  APPEND ls_comp TO lt_components.

  " SOLID C
  ls_comp-item_no   = '0070'.
  ls_comp-part_type = 'PF'.
  ls_comp-matnr     = '7'.
  ls_comp-maktx     = 'COMP 2 SOLID C DC CORRIDOR MU'.
  ls_comp-dim_t     = 28.
  ls_comp-dim_w     = 120.
  ls_comp-dim_l     = 14000.
  ls_comp-qty       = 6.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1307'.
  ls_comp-note      = 'Finish Presisi'.
  APPEND ls_comp TO lt_components.

  ls_comp-item_no   = '0080'.
  ls_comp-part_type = 'SF'.
  ls_comp-matnr     = '8'.
  ls_comp-maktx     = 'PART CORE MLD SOLID C DC CORRIDOR MU'.
  ls_comp-dim_t     = 30.
  ls_comp-dim_w     = 125.
  ls_comp-dim_l     = 14010.
  ls_comp-qty       = 6.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1E04'.
  ls_comp-note      = 'Rough Size Core Moulding'.
  APPEND ls_comp TO lt_components.

  " SOLID D
  ls_comp-item_no   = '0090'.
  ls_comp-part_type = 'PF'.
  ls_comp-matnr     = '9'.
  ls_comp-maktx     = 'COMP 2 SOLID D DC CORRIDOR MU'.
  ls_comp-dim_t     = 28.
  ls_comp-dim_w     = 47.
  ls_comp-dim_l     = 14000.
  ls_comp-qty       = 1.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1307'.
  ls_comp-note      = 'Finish Presisi'.
  APPEND ls_comp TO lt_components.

  ls_comp-item_no   = '0100'.
  ls_comp-part_type = 'SF'.
  ls_comp-matnr     = '10'.
  ls_comp-maktx     = 'PART CORE MLD SOLID D DC CORRIDOR MU'.
  ls_comp-dim_t     = 30.
  ls_comp-dim_w     = 52.
  ls_comp-dim_l     = 14010.
  ls_comp-qty       = 1.
  ls_comp-meins     = 'PC'.
  ls_comp-sloc_prod = '1E04'.
  ls_comp-note      = 'Rough Size Core Moulding'.
  APPEND ls_comp TO lt_components.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form f_process_header_routing
*&---------------------------------------------------------------------*
FORM f_process_header_routing.
  DATA: lv_testrun    TYPE char1,
        lv_conv_matnr TYPE matnr.

  REFRESH: lt_task, lt_mtk, lt_opr, lt_rout_return.
  CLEAR: ls_task, ls_mtk, ls_opr, lv_group, lv_group_ctr.

  " Header Task
  ls_task-task_list_usage   = '1'.
  ls_task-plant             = p_werks.
  ls_task-task_list_status  = '4'.
  ls_task-description       = p_maktx.
  ls_task-lot_size_from     = 0.
  ls_task-lot_size_to       = 99999999.
  ls_task-task_measure_unit = 'SET'.
  ls_task-valid_from_date   = sy-datum.
  APPEND ls_task TO lt_task.

  " Material Allocation
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

  " Operasi Finishing & Pelapisan (WC089 - OIL)
  ls_opr-operation_number       = '0010'.
  ls_opr-work_cntr              = 'WC089'.
  ls_opr-plant                  = p_werks.
  ls_opr-control_key            = 'ZP01'.
  ls_opr-description            = 'OIL / COATING SEALER'.
  ls_opr-base_quantity          = 1.
  ls_opr-operation_measure_unit = 'SET'.
  ls_opr-denominator            = 1.
  ls_opr-numerator              = 1.
  ls_opr-valid_from_date        = sy-datum.

  ls_opr-standard_value_01      = p_paint.
  ls_opr-standard_unit_01       = 'MIN'.
  APPEND ls_opr TO lt_opr.

  CLEAR ls_log.
  ls_log-level        = 'Level 0 (Header FG)'.
  ls_log-matnr        = p_matnr.
  ls_log-maktx        = p_maktx.
  ls_log-vornr        = '0010'.
  ls_log-arbpl        = 'WC089'.
  ls_log-ltxa1        = 'OIL'.
  ls_log-duration     = p_paint.
  ls_log-unit         = 'MIN'.
  ls_log-formula_note = 'Diambil dari spesifikasi Painting Header'.

  IF p_prev = 'X'.
    " Mode 1: Preview Murni - Tanpa Panggil BAPI
    ls_log-status  = 'PREVIEW'.
    ls_log-message = 'Kalkulasi Berhasil (Belum dikirim ke BAPI)'.
  ELSE.
    " Mode 2 atau 3: Panggil BAPI SAP
    IF p_simu = 'X'.
      lv_testrun = 'X'.
    ELSE.
      lv_testrun = ' '.
    ENDIF.

    CALL FUNCTION 'BAPI_ROUTING_CREATE'
      EXPORTING
        testrun                = lv_testrun
      IMPORTING
        group                  = lv_group
        groupcounter           = lv_group_ctr
      TABLES
        task                   = lt_task
        materialtaskallocation = lt_mtk
        operation              = lt_opr
        return                 = lt_rout_return.

    ls_log-group         = lv_group.
    ls_log-group_counter = lv_group_ctr.

    READ TABLE lt_rout_return INTO ls_rout_return WITH KEY type = 'E'.
    IF sy-subrc = 0.
      ls_log-status  = 'GAGAL'.
      ls_log-message = ls_rout_return-message.
    ELSE.
      IF p_simu = 'X'.
        ls_log-status  = 'SIMULASI OK'.
        ls_log-message = 'Simulasi BAPI Valid (Rollback)'.
      ELSE.
        ls_log-status  = 'BERHASIL'.
        ls_log-message = 'Routing Header Terbentuk di SAP'.
      ENDIF.
    ENDIF.

    IF p_exec = 'X' AND ls_log-status = 'BERHASIL'.
      CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = 'X'.
    ELSE.
      CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
    ENDIF.
  ENDIF.

  APPEND ls_log TO lt_log.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form f_process_component_routings
*&---------------------------------------------------------------------*
FORM f_process_component_routings.
  DATA: lv_testrun TYPE char1,
        lv_conv_matnr TYPE matnr,
        lv_detik TYPE i.

  IF p_simul = 'X'.
    lv_testrun = 'X'.
  ELSE.
    lv_testrun = ' '.
  ENDIF.

  LOOP AT lt_components INTO ls_comp.
    REFRESH: lt_task, lt_mtk, lt_opr, lt_rout_return.
    CLEAR: ls_task, ls_mtk, ls_opr, lv_group, lv_group_ctr.

    " 1. Task List Header
    ls_task-task_list_usage   = '1'.
    ls_task-plant             = p_werks.
    ls_task-task_list_status  = '4'.
    ls_task-description       = ls_comp-maktx.
    ls_task-lot_size_from     = 0.
    ls_task-lot_size_to       = 99999999.
    ls_task-task_measure_unit = ls_comp-meins.
    ls_task-valid_from_date   = sy-datum.
    APPEND ls_task TO lt_task.

    " 2. Material Allocation
    CALL FUNCTION 'CONVERSION_EXIT_MATN1_INPUT'
      EXPORTING
        input  = ls_comp-matnr
      IMPORTING
        output = lv_conv_matnr.

    ls_mtk-material           = lv_conv_matnr.
    ls_mtk-plant              = p_werks.
    ls_mtk-task_list_usage    = '1'.
    ls_mtk-valid_from_date    = sy-datum.
    APPEND ls_mtk TO lt_mtk.

    " 3. Aturan Routing Otomatis
    IF ls_comp-part_type = 'PF'.
      " Operasi 1: CNC (WC076)
      CLEAR ls_opr.
      ls_opr-operation_number       = '0010'.
      ls_opr-work_cntr              = 'WC076'.
      ls_opr-plant                  = p_werks.
      ls_opr-control_key            = 'ZP03'.
      ls_opr-description            = 'CNC (GROOVING/SIKU)'.
      ls_opr-base_quantity          = 1.
      ls_opr-operation_measure_unit = ls_comp-meins.
      ls_opr-standard_value_01      = 120.
      ls_opr-standard_unit_01       = 'S'.
      ls_opr-denominator            = 1.
      ls_opr-numerator              = 1.
      ls_opr-valid_from_date        = sy-datum.
      APPEND ls_opr TO lt_opr.

      " Operasi 2: SANDER (WC110)
      CLEAR ls_opr.
      ls_opr-operation_number       = '0020'.
      ls_opr-work_cntr              = 'WC110'.
      ls_opr-plant                  = p_werks.
      ls_opr-control_key            = 'ZP01'.
      ls_opr-description            = 'SANDER (PENGAMPLASAN)'.
      ls_opr-base_quantity          = 1.
      ls_opr-operation_measure_unit = ls_comp-meins.
      ls_opr-standard_value_01      = 1.
      ls_opr-standard_unit_01       = 'MIN'.
      ls_opr-denominator            = 1.
      ls_opr-numerator              = 1.
      ls_opr-valid_from_date        = sy-datum.
      APPEND ls_opr TO lt_opr.

    ELSEIF ls_comp-part_type = 'SF'.
      " Operasi 1: MOULDING (WC046)
      " Rumus Otomatis: (Panjang / 1000) * 60 Detik
      lv_detik = ( ls_comp-dim_l * 60 ) / 1000.

      CLEAR ls_opr.
      ls_opr-operation_number       = '0010'.
      ls_opr-work_cntr              = 'WC046'.
      ls_opr-plant                  = p_werks.
      ls_opr-control_key            = 'ZP01'.
      ls_opr-description            = 'MOULDING UNIMAT 22 E'.
      ls_opr-base_quantity          = 1.
      ls_opr-operation_measure_unit = ls_comp-meins.
      ls_opr-standard_value_01      = lv_detik.
      ls_opr-standard_unit_01       = 'S'.
      ls_opr-denominator            = 1.
      ls_opr-numerator              = 1.
      ls_opr-valid_from_date        = sy-datum.
      APPEND ls_opr TO lt_opr.
    ENDIF.

    " 4. Eksekusi / Preview Sesuai Mode
    IF p_prev = 'X'.
      " Mode 1: Preview Murni - Tanpa Panggil BAPI
      LOOP AT lt_opr INTO ls_opr.
        CLEAR ls_log.
        IF ls_comp-part_type = 'PF'.
          ls_log-level = 'Level 1 (Part Finish)'.
        ELSE.
          ls_log-level = 'Level 2 (Core Moulding)'.
        ENDIF.
        ls_log-matnr    = ls_comp-matnr.
        ls_log-maktx    = ls_comp-maktx.
        ls_log-vornr    = ls_opr-operation_number.
        ls_log-arbpl    = ls_opr-work_cntr.
        ls_log-ltxa1    = ls_opr-description.
        ls_log-duration = ls_opr-standard_value_01.
        ls_log-unit     = ls_opr-standard_unit_01.
        ls_log-status   = 'PREVIEW'.
        ls_log-message  = 'Kalkulasi Berhasil (Belum dikirim ke BAPI)'.

        IF ls_opr-work_cntr = 'WC046'.
          ls_log-formula_note =
            |Panjang: { ls_comp-dim_l } mm -> ({ ls_comp-dim_l }/1000)*60 = { ls_opr-standard_value_01 } S|.
        ELSEIF ls_opr-work_cntr = 'WC076'.
          ls_log-formula_note = 'Standar CNC 120 Detik (Grooving & Siku)'.
        ELSEIF ls_opr-work_cntr = 'WC110'.
          ls_log-formula_note = 'Standar Sander 1 Menit Pengamplasan'.
        ENDIF.
        APPEND ls_log TO lt_log.
      ENDLOOP.

    ELSE.
      " Mode 2 atau 3: Panggil BAPI SAP
      IF p_simu = 'X'.
        lv_testrun = 'X'.
      ELSE.
        lv_testrun = ' '.
      ENDIF.

      CALL FUNCTION 'BAPI_ROUTING_CREATE'
        EXPORTING
          testrun                = lv_testrun
        IMPORTING
          group                  = lv_group
          groupcounter           = lv_group_ctr
        TABLES
          task                   = lt_task
          materialtaskallocation = lt_mtk
          operation              = lt_opr
          return                 = lt_rout_return.

      " Catat Log BAPI
      LOOP AT lt_opr INTO ls_opr.
        CLEAR ls_log.
        IF ls_comp-part_type = 'PF'.
          ls_log-level = 'Level 1 (Part Finish)'.
        ELSE.
          ls_log-level = 'Level 2 (Core Moulding)'.
        ENDIF.
        ls_log-matnr         = ls_comp-matnr.
        ls_log-maktx         = ls_comp-maktx.
        ls_log-vornr         = ls_opr-operation_number.
        ls_log-arbpl         = ls_opr-work_cntr.
        ls_log-ltxa1         = ls_opr-description.
        ls_log-duration      = ls_opr-standard_value_01.
        ls_log-unit          = ls_opr-standard_unit_01.
        ls_log-group         = lv_group.
        ls_log-group_counter = lv_group_ctr.

        IF ls_opr-work_cntr = 'WC046'.
          ls_log-formula_note =
            |Panjang: { ls_comp-dim_l } mm -> ({ ls_comp-dim_l }/1000)*60 = { ls_opr-standard_value_01 } S|.
        ELSEIF ls_opr-work_cntr = 'WC076'.
          ls_log-formula_note = 'Standar CNC 120 Detik (Grooving & Siku)'.
        ELSEIF ls_opr-work_cntr = 'WC110'.
          ls_log-formula_note = 'Standar Sander 1 Menit Pengamplasan'.
        ENDIF.

        READ TABLE lt_rout_return INTO ls_rout_return WITH KEY type = 'E'.
        IF sy-subrc = 0.
          ls_log-status  = 'GAGAL'.
          ls_log-message = ls_rout_return-message.
        ELSE.
          IF p_simu = 'X'.
            ls_log-status  = 'SIMULASI OK'.
            ls_log-message = 'Simulasi BAPI Valid (Rollback)'.
          ELSE.
            ls_log-status  = 'BERHASIL'.
            ls_log-message = 'Routing Komponen Terbentuk di SAP'.
          ENDIF.
        ENDIF.
        APPEND ls_log TO lt_log.
      ENDLOOP.

      IF p_exec = 'X' AND ls_log-status = 'BERHASIL'.
        CALL FUNCTION 'BAPI_TRANSACTION_COMMIT' EXPORTING wait = 'X'.
      ELSE.
        CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
      ENDIF.
    ENDIF.

  ENDLOOP.
ENDFORM.

*&---------------------------------------------------------------------*
*& Form f_display_results
*&---------------------------------------------------------------------*
FORM f_display_results.
  WRITE: / '========================================================================================='.
  WRITE: / '          LAPORAN EKSEKUSI OTOMASI ROUTING SAP (MULTI-LEVEL AUTO ROUTING)                '.
  WRITE: / '========================================================================================='.
  IF p_prev = 'X'.
    FORMAT COLOR COL_NORMAL INTENSIFIED ON.
    WRITE: / 'MODE EKSEKUSI : 1. PREVIEW DATA & HITUNGAN (100% AMAN - BELUM SENTUH SAP BAPI)', /.
    FORMAT RESET.
  ELSEIF p_simu = 'X'.
    FORMAT COLOR COL_TOTAL INTENSIFIED ON.
    WRITE: / 'MODE EKSEKUSI : 2. UJI COBA BAPI (TEST RUN - ROLLBACK / TIDAK TERSIMPAN KE SAP)', /.
    FORMAT RESET.
  ELSE.
    FORMAT COLOR COL_NEGATIVE INTENSIFIED ON.
    WRITE: / 'MODE EKSEKUSI : 3. EKSEKUSI NYATA KE SAP (LIVE COMMIT DATABASE SAP)', /.
    FORMAT RESET.
  ENDIF.

  FORMAT COLOR COL_HEADING.
  WRITE: /(22) 'Level', (10) 'Matnr', (10) 'Operation', (8) 'Work Ctr',
         (24) 'Deskripsi Operasi', (12) 'Durasi', (45) 'Kalkulasi Otomatis', (14) 'Status'.
  FORMAT RESET.
  ULINE.

  LOOP AT lt_log INTO ls_log.
    IF ls_log-status = 'BERHASIL' OR ls_log-status = 'SIMULASI OK'.
      FORMAT COLOR COL_POSITIVE INTENSIFIED OFF.
    ELSEIF ls_log-status = 'PREVIEW'.
      FORMAT COLOR COL_TOTAL INTENSIFIED OFF.
    ELSE.
      FORMAT COLOR COL_NEGATIVE INTENSIFIED ON.
    ENDIF.

    WRITE: /(22) ls_log-level,
            (10) ls_log-matnr,
            (10) ls_log-vornr,
            (8)  ls_log-arbpl,
            (24) ls_log-ltxa1,
            (12) |{ ls_log-duration } { ls_log-unit }|,
            (45) ls_log-formula_note,
            (14) ls_log-status.
  ENDLOOP.
  ULINE.
  WRITE: / 'Total Operasi Berhasil Diproses:', lines( lt_log ).
  WRITE: / '========================================================================================='.
ENDFORM.
