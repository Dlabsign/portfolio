import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()

# Setup Styles
font_title = Font(name='Calibri', size=14, bold=True, color='1E3A8A')
font_subtitle = Font(name='Calibri', size=10, italic=True, color='4B5563')
font_tbl_hdr = Font(name='Calibri', size=10, bold=True, color='FFFFFF')
font_data = Font(name='Calibri', size=10, color='1F2937')
font_bold = Font(name='Calibri', size=10, bold=True, color='1F2937')

fill_navy = PatternFill(start_color='1E3A8A', end_color='1E3A8A', fill_type='solid')
fill_blue_hdr = PatternFill(start_color='2563EB', end_color='2563EB', fill_type='solid')
fill_light_blue = PatternFill(start_color='DBEAFE', end_color='DBEAFE', fill_type='solid')
fill_soft_gray = PatternFill(start_color='F9FAFB', end_color='F9FAFB', fill_type='solid')
fill_soft_green = PatternFill(start_color='ECFDF5', end_color='ECFDF5', fill_type='solid')
fill_soft_yellow = PatternFill(start_color='FEF3C7', end_color='FEF3C7', fill_type='solid')

thin_border = Border(
    left=Side(style='thin', color='D1D5DB'),
    right=Side(style='thin', color='D1D5DB'),
    top=Side(style='thin', color='D1D5DB'),
    bottom=Side(style='thin', color='D1D5DB')
)

align_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
align_left = Alignment(horizontal='left', vertical='center')
align_right = Alignment(horizontal='right', vertical='center')

# ==========================================
# 1. SHEET: BOM Material
# ==========================================
ws1 = wb.active
ws1.title = 'BOM Material'
ws1.views.sheetView[0].showGridLines = True

# Title
ws1['A2'] = 'TEMPLATE UPLOAD BOM MATERIAL (KOMPONEN KAYU)'
ws1['A2'].font = font_title
ws1['A3'] = 'Gunakan sheet ini untuk mendaftarkan komponen Part Finish (PF) dan Part Core Moulding (SF).'
ws1['A3'].font = font_subtitle

# Header Info Block
headers_meta = [
    ('Product Name', ': DC - Corridor Mockup', 'Header Material SAP', '30014254'),
    ('Product Code', 'DC CORRIDOR MU', 'Plant', '1000'),
    ('Product Type', 'Project Mockup KMI', 'Order Qty', 1),
    ('Finish Size', '28 x 1750 x 14000 mm', 'Base UoM', 'SET'),
    ('Painting / Finish', 'Joystick Sealer', 'Alokasi Waktu Paint', '180 MIN')
]

r_start = 5
for i, item in enumerate(headers_meta):
    r = r_start + i
    ws1[f'B{r}'] = item[0]
    ws1[f'B{r}'].font = font_bold
    ws1[f'B{r}'].fill = fill_light_blue
    ws1[f'C{r}'] = item[1]
    ws1[f'C{r}'].font = font_data
    
    ws1[f'E{r}'] = item[2]
    ws1[f'E{r}'].font = font_bold
    ws1[f'E{r}'].fill = fill_light_blue
    ws1[f'F{r}'] = item[3]
    ws1[f'F{r}'].font = font_data

# Table Header
r_tbl = 12
headers_col = [
    'No', 'Tipe Part\n(PF / SF)', 'Part ID\n(BOM Pos)', 'Nama Komponen\n(Part Name)',
    'Rough Size (mm)\nT x W x L', 'Finish Size (mm)\nT x W x L', 'T (mm)', 'W (mm)', 'L (mm)',
    'Qty', 'UoM', 'Jenis Kayu', 'Sloc Prod', 'Sloc Issue', 'Catatan / Alur Khusus', 'Auto Routing Preview'
]

for col_idx, h in enumerate(headers_col, 1):
    cell = ws1.cell(r_tbl, col_idx)
    cell.value = h
    cell.font = font_tbl_hdr
    cell.fill = fill_navy
    cell.alignment = align_center
    cell.border = thin_border
ws1.row_dimensions[r_tbl].height = 28

# Sample Data
sample_components = [
    (1, 'PF', '1', 'JOYSTICK CORRIDOR', '-', '50 x 70 x 1750', 50, 70, 1750, 26, 'PC', 'ULIN', '1307', '-', 'Ada Grooving U/ Decking', 'WC076 CNC (120s) + WC110 Sander (1m)'),
    ('', 'SF', '2', 'CORE MLD JOYSTICK', '52 x 75 x 1760', '50 x 70 x 1750', 52, 75, 1760, 26, 'PC', 'ULIN', '1E04', '1306', 'Dari Raw Ulin 20175422', 'WC046 Moulding ((1760/1000)*60 = 105s)'),
    (2, 'PF', '3', 'SOLID A', '-', '28 x 55 x 14000', 28, 55, 14000, 5, 'PC', 'ULIN', '1307', '-', 'Permukaan Rata Presisi', 'WC076 CNC (120s) + WC110 Sander (1m)'),
    ('', 'SF', '4', 'CORE MLD SOLID A', '30 x 60 x 14010', '28 x 55 x 14000', 30, 60, 14010, 5, 'PC', 'ULIN', '1E04', '1306', 'Dari Raw Ulin 20175422', 'WC046 Moulding ((14010/1000)*60 = 840s)'),
    (3, 'PF', '5', 'SOLID B', '-', '28 x 85 x 14000', 28, 85, 14000, 8, 'PC', 'ULIN', '1307', '-', 'Permukaan Rata Presisi', 'WC076 CNC (120s) + WC110 Sander (1m)'),
    ('', 'SF', '6', 'CORE MLD SOLID B', '30 x 90 x 14010', '28 x 85 x 14000', 30, 90, 14010, 8, 'PC', 'ULIN', '1E04', '1306', 'Dari Raw Ulin 20175422', 'WC046 Moulding ((14010/1000)*60 = 840s)'),
    (4, 'PF', '7', 'SOLID C', '-', '28 x 120 x 14000', 28, 120, 14000, 6, 'PC', 'ULIN', '1307', '-', 'Permukaan Rata Presisi', 'WC076 CNC (120s) + WC110 Sander (1m)'),
    ('', 'SF', '8', 'CORE MLD SOLID C', '30 x 125 x 14010', '28 x 120 x 14000', 30, 125, 14010, 6, 'PC', 'ULIN', '1E04', '1306', 'Dari Raw Ulin 20175422', 'WC046 Moulding ((14010/1000)*60 = 840s)'),
    (5, 'PF', '9', 'SOLID D', '-', '28 x 47 x 14000', 28, 47, 14000, 1, 'PC', 'ULIN', '1307', '-', 'Permukaan Rata Presisi', 'WC076 CNC (120s) + WC110 Sander (1m)'),
    ('', 'SF', '10', 'CORE MLD SOLID D', '30 x 52 x 14010', '28 x 47 x 14000', 30, 52, 14010, 1, 'PC', 'ULIN', '1E04', '1306', 'Dari Raw Ulin 20175422', 'WC046 Moulding ((14010/1000)*60 = 840s)')
]

for row_idx, row_vals in enumerate(sample_components, r_tbl + 1):
    ws1.row_dimensions[row_idx].height = 20
    is_sf = (row_vals[1] == 'SF')
    bg_fill = fill_soft_yellow if is_sf else fill_soft_gray
    
    for col_idx, val in enumerate(row_vals, 1):
        c = ws1.cell(row_idx, col_idx, val)
        c.font = font_data
        c.border = thin_border
        c.fill = bg_fill
        if col_idx in [1, 2, 3, 10, 11, 13, 14]:
            c.alignment = align_center
        elif col_idx in [7, 8, 9]:
            c.alignment = align_right
        else:
            c.alignment = align_left

# ==========================================
# 2. SHEET: BOM Hardware
# ==========================================
ws2 = wb.create_sheet(title='BOM Hardware')
ws2.views.sheetView[0].showGridLines = True

ws2['A2'] = 'TEMPLATE UPLOAD BOM HARDWARE'
ws2['A2'].font = font_title
ws2['A3'] = 'Komponen hardware otomatis dialokasikan ke Header Assembly Mockup di Sloc 1309.'
ws2['A3'].font = font_subtitle

# Header Meta
ws2['B5'] = 'Product Code'
ws2['B5'].font = font_bold
ws2['B5'].fill = fill_light_blue
ws2['C5'] = 'DC CORRIDOR MU'
ws2['C5'].font = font_data

ws2['E5'] = 'Staging Sloc'
ws2['E5'].font = font_bold
ws2['E5'].fill = fill_light_blue
ws2['F5'] = '1309'
ws2['F5'].font = font_data

r_tbl_hw = 8
headers_hw = [
    'No', 'Kode Barang SAP', 'Nama Barang / Spesifikasi Hardware', 'Qty / Order',
    'Satuan', 'Fungsi / Posisi Pemasangan', 'Note Pengadaan', 'Routing Allocation'
]

for col_idx, h in enumerate(headers_hw, 1):
    cell = ws2.cell(r_tbl_hw, col_idx)
    cell.value = h
    cell.font = font_tbl_hdr
    cell.fill = fill_navy
    cell.alignment = align_center
    cell.border = thin_border
ws2.row_dimensions[r_tbl_hw].height = 26

sample_hw = [
    (1, 'RHSCNG00247', 'CONNECTOR HS 8302.42 UK 60X22X2 (MALE)', 520, 'Pcs', 'U/ Sambungan Solid Decking', 'By KMI - Taufiq Canggu', 'Header Op 0010 (WC089)'),
    (2, 'RHSCNG00248', 'CONNECTOR HS 8302.42 UK 60X32X2 (FEMALE)', 26, 'Pcs', 'U/ Sambungan Solid Decking', 'By KMI', 'Header Op 0010 (WC089)'),
    (3, 'RHSSCR00026', 'SCREW JF (+) 6MMX1" ZINC DMT', 1092, 'Pcs', 'U/ Connector Male - Female', 'By KMI', 'Header Op 0010 (WC089)'),
    (4, 'RHSLVL00001', 'LEVELER BUZON / ETERNO FLOORING', 110, 'Pcs', 'Untuk Decking Corridor', 'By KMI - Taufiq Canggu', 'Header Op 0010 (WC089)'),
    (5, 'RHSSCR00086', 'SCREW JP (+) 8MMX1-1/2" SS DMT', 220, 'Pcs', 'Untuk Fischer Sx6', 'By KMI - Ganti ss', 'Header Op 0010 (WC089)'),
    (6, 'RHSSCR00118', 'SCREW JP SS 8MM X 1"', 220, 'Pcs', 'Untuk Buzon ke Joystick', 'By KMI - Tambahan', 'Header Op 0010 (WC089)'),
    (7, 'RHSNUT00014', 'HARDWARE FISHER S6', 300, 'Pcs', 'Untuk Buzon ke Lantai', 'By KMI', 'Header Op 0010 (WC089)')
]

for row_idx, row_vals in enumerate(sample_hw, r_tbl_hw + 1):
    ws2.row_dimensions[row_idx].height = 20
    for col_idx, val in enumerate(row_vals, 1):
        c = ws2.cell(row_idx, col_idx, val)
        c.font = font_data
        c.border = thin_border
        c.fill = fill_soft_gray
        if col_idx in [1, 2, 4, 5]:
            c.alignment = align_center
        else:
            c.alignment = align_left

# ==========================================
# 3. SHEET: Panduan Auto-Routing
# ==========================================
ws3 = wb.create_sheet(title='Panduan Auto-Routing')
ws3.views.sheetView[0].showGridLines = True

ws3['A2'] = 'PANDUAN DAN ATURAN OTOMASI ROUTING (SAP AUTO-ROUTING)'
ws3['A2'].font = font_title
ws3['A3'] = 'Sistem SAP menurunkan routing otomatis dari data BOM tanpa perlu input manual:'
ws3['A3'].font = font_subtitle

guide_rules = [
    ('Tingkat Level', 'Work Center', 'Control Key', 'Rumus / Dasar Waktu', 'Keterangan Operasi'),
    ('Level 2: Part Core Moulding (SF)', 'WC046\n(MOULDING UNIMAT 22 E)', 'ZP01', 'Waktu (Detik) = (L / 1000) * 60 Detik', 'Kecepatan potong mesin serut moulding konstan 1 m/menit. Dihitung otomatis dari panjang kayu.'),
    ('Level 1: Komponen Jadi (PF)', 'Op 0010: WC076 (CNC)\nOp 0020: WC110 (SANDER)', 'ZP03\nZP01', 'Op 0010: 120 Detik (S)\nOp 0020: 1 Menit (MIN)', 'Op 0010 u/ pembentukan alur grooving & siku. Op 0020 u/ penghalusan permukaan kayu.'),
    ('Level 0: Header Mockup Set', 'Op 0010: WC089 (OIL)', 'ZP01', '180 Menit (MIN)', 'Perakitan akhir dan pelapisan pelindung kayu (Joystick Sealer). Diambil dari data Painting.'),
    ('BOM Hardware', 'Header Allocation', '-', 'Dialokasikan ke Op 0010 Header (WC089)', 'Hardware tidak memerlukan routing sendiri karena berstatus material beli (ROH/Trading).')
]

r_tbl_g = 6
for row_idx, r_vals in enumerate(guide_rules, r_tbl_g):
    ws3.row_dimensions[row_idx].height = 30
    is_head = (row_idx == r_tbl_g)
    for col_idx, val in enumerate(r_vals, 1):
        c = ws3.cell(row_idx, col_idx, val)
        c.border = thin_border
        if is_head:
            c.font = font_tbl_hdr
            c.fill = fill_navy
            c.alignment = align_center
        else:
            c.font = font_data
            c.fill = fill_soft_green if 'Level 2' in r_vals[0] else fill_soft_gray
            c.alignment = align_left

# Set Column Widths for all sheets
for ws in [ws1, ws2, ws3]:
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            val_str = str(cell.value or '')
            if '\n' in val_str:
                val_str = max(val_str.split('\n'), key=len)
            max_len = max(max_len, len(val_str))
        ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

ws1.column_dimensions['D'].width = 25
ws1.column_dimensions['P'].width = 38
ws2.column_dimensions['C'].width = 45
ws2.column_dimensions['F'].width = 30
ws3.column_dimensions['A'].width = 30
ws3.column_dimensions['B'].width = 28
ws3.column_dimensions['D'].width = 35
ws3.column_dimensions['E'].width = 50

output_path = r'PENJUALAN\Excel\TEMPLATE_UPLOAD_BOM_DAN_HARDWARE.xlsx'
wb.save(output_path)
print(f'Template berhasil disimpan di: {output_path}')
