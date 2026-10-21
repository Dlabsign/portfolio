*----------------------------------------------------------------------*
* Event Handler : OnInitialization
* Page          : test_ai.htm
* Table Target  : ZMDG_AI_CHAT_LOG (SAP MDG AI Chat History)
*----------------------------------------------------------------------*
TYPES: BEGIN OF ty_chat_log_json,
         chat_id       TYPE string,
         msg_id        TYPE string,
         username      TYPE string,
         chat_date     TYPE string,
         chat_time     TYPE string,
         prompt_text   TYPE string,
         response_text TYPE string,
         status        TYPE string,
         model_name    TYPE string,
         input_tokens  TYPE i,
         output_tokens TYPE i,
         total_tokens  TYPE i,
       END OF ty_chat_log_json.

DATA: lt_chat_db    TYPE TABLE OF zmdg_ai_chat_log,
      ls_chat_db    TYPE zmdg_ai_chat_log,
      lt_chat_json  TYPE TABLE OF ty_chat_log_json,
      ls_chat_json  TYPE ty_chat_log_json,
      gv_chat_json  TYPE string,
      lv_usr_bapi   TYPE bapiaddr3,
      lt_usr_ret    TYPE TABLE OF bapiret2,
      lv_usr_pers   TYPE usr21-persnumber,
      gv_first_name TYPE string,
      gv_greeting   TYPE string,
      lv_full_name  TYPE string.

* 1. Ambil data master user via BAPI standar SAP (BAPI_USER_GET_DETAIL)
CALL FUNCTION 'BAPI_USER_GET_DETAIL'
  EXPORTING
    username = sy-uname
  IMPORTING
    address  = lv_usr_bapi
  TABLES
    return   = lt_usr_ret.

IF lv_usr_bapi-firstname IS NOT INITIAL.
  gv_first_name = lv_usr_bapi-firstname.
ELSE.
  " Fallback: Periksa tabel USR21 dan ADRP
  SELECT SINGLE persnumber
    FROM usr21
    INTO lv_usr_pers
    WHERE bname = sy-uname.
  IF sy-subrc = 0.
    SELECT SINGLE name_first
      FROM adrp
      INTO gv_first_name
      WHERE persnumber = lv_usr_pers.
  ENDIF.
ENDIF.

IF gv_first_name IS INITIAL.
  IF lv_usr_bapi-fullname IS NOT INITIAL.
    SPLIT lv_usr_bapi-fullname AT space INTO gv_first_name lv_full_name.
  ELSE.
    gv_first_name = sy-uname.
  ENDIF.
ENDIF.
CONDENSE gv_first_name.

* 2. Tentukan sapaan waktu berdasarkan jam server SAP
IF sy-uzeit < '120000'.
  gv_greeting = 'Selamat Pagi'.
ELSEIF sy-uzeit < '180000'.
  gv_greeting = 'Selamat Siang'.
ELSE.
  gv_greeting = 'Selamat Malam'.
ENDIF.

" Read chat history logs for current user from ZMDG_AI_CHAT_LOG
SELECT * FROM zmdg_ai_chat_log
  WHERE username = @sy-uname
  ORDER BY chat_date DESCENDING, chat_time DESCENDING, msg_id DESCENDING
  INTO TABLE @lt_chat_db
  UP TO 100 ROWS.

LOOP AT lt_chat_db INTO ls_chat_db.
  CLEAR ls_chat_json.
  ls_chat_json-chat_id       = ls_chat_db-chat_id.
  ls_chat_json-msg_id        = ls_chat_db-msg_id.
  ls_chat_json-username      = ls_chat_db-username.
  ls_chat_json-chat_date     = ls_chat_db-chat_date.
  ls_chat_json-chat_time     = ls_chat_db-chat_time.
  ls_chat_json-prompt_text   = ls_chat_db-prompt_text.
  ls_chat_json-response_text = ls_chat_db-response_text.
  ls_chat_json-status        = ls_chat_db-status.
  ls_chat_json-model_name    = ls_chat_db-model_name.
  ls_chat_json-input_tokens  = ls_chat_db-input_tokens.
  ls_chat_json-output_tokens = ls_chat_db-output_tokens.
  ls_chat_json-total_tokens  = ls_chat_db-total_tokens.
  APPEND ls_chat_json TO lt_chat_json.
ENDLOOP.

/ui2/cl_json=>serialize(
  EXPORTING
    data        = lt_chat_json
    compress    = 'X'
    pretty_name = /ui2/cl_json=>pretty_mode-low_case
  RECEIVING
    r_json      = gv_chat_json ).
