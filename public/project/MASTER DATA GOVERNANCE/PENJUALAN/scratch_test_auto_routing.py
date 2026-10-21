import openpyxl

wb = openpyxl.load_workbook(r'PENJUALAN\Excel\ROUTING BARU 2.xlsx', data_only=True)

# 1. Read BOM Material
ws_mat = wb['Bom Material']
product_name = ws_mat['H4'].value or ws_mat['F4'].value
product_code = ws_mat['H6'].value or ws_mat['D6'].value
painting = ws_mat['H8'].value or ws_mat['F8'].value

print("=" * 80)
print(f"INFORMASI HEADER BOM:")
print(f"Product Name : {product_name}")
print(f"Product Code : {product_code}")
print(f"Painting     : {painting}")
print("=" * 80)

components = []
for r in range(16, 26):
    code_type = ws_mat.cell(r, 2).value  # PF or SF
    part_id = ws_mat.cell(r, 4).value    # 1, 2, 3...
    dim_text = ws_mat.cell(r, 5).value   # 50X70X1750
    part_name = ws_mat.cell(r, 6).value
    t = ws_mat.cell(r, 14).value
    w = ws_mat.cell(r, 15).value
    l = ws_mat.cell(r, 16).value
    qty = ws_mat.cell(r, 17).value
    desc = ws_mat.cell(r, 22).value
    components.append({
        'row': r,
        'code_type': str(code_type).strip() if code_type else '',
        'part_id': str(part_id).strip() if part_id else '',
        'part_name': part_name,
        'dim_text': dim_text,
        't': float(t) if t else 0,
        'w': float(w) if w else 0,
        'l': float(l) if l else 0,
        'qty': qty,
        'desc': desc
    })

# 2. Read BOM Hardware
ws_hw = wb['Bom Hardware']
hardwares = []
for r in range(15, 22):
    no = ws_hw.cell(r, 1).value
    k_brg = ws_hw.cell(r, 2).value
    n_brg = ws_hw.cell(r, 3).value
    qty = ws_hw.cell(r, 4).value
    satuan = ws_hw.cell(r, 6).value
    ket = ws_hw.cell(r, 7).value
    if n_brg:
        hardwares.append({
            'no': no,
            'kode': k_brg,
            'nama': n_brg,
            'qty': qty,
            'satuan': satuan,
            'ket': ket
        })

print(f"\nKomponen Kayu terdeteksi: {len(components)} item")
print(f"Hardware terdeteksi      : {len(hardwares)} item")
print("-" * 80)

# 3. Simulate Auto-Routing Generation
routings = []

# Level 0: Header FG
routings.append({
    'level': 'Level 0 (Header FG)',
    'matnr': '30014254',
    'desc': 'DECKING CORRIDOR MOCKUP',
    'plant': '1000',
    'vornr': '0010',
    'arbpl': 'WC089',
    'steus': 'ZP01',
    'ltxa1': 'OIL',
    'base_qty': 1,
    'meinh': 'PC',
    'val': 180,
    'unit': 'MIN',
    'allocations': [h['nama'] for h in hardwares]
})

# Level 1: Part Finish (PF)
for c in components:
    if c['code_type'] == 'PF':
        # Op 0010: CNC
        routings.append({
            'level': 'Level 1 (Part Finish)',
            'matnr': c['part_id'],
            'desc': c['desc'],
            'plant': '1000',
            'vornr': '0010',
            'arbpl': 'WC076',
            'steus': 'ZP03',
            'ltxa1': 'CNC',
            'base_qty': 1,
            'meinh': 'PC',
            'val': 120,
            'unit': 'S'
        })
        # Op 0020: SANDER
        routings.append({
            'level': 'Level 1 (Part Finish)',
            'matnr': c['part_id'],
            'desc': c['desc'],
            'plant': '1000',
            'vornr': '0020',
            'arbpl': 'WC110',
            'steus': 'ZP01',
            'ltxa1': 'SANDER',
            'base_qty': 1,
            'meinh': 'PC',
            'val': 1,
            'unit': 'MIN'
        })

# Level 2: Part Core Moulding (SF)
for c in components:
    if c['code_type'] == 'SF':
        calc_time = int((c['l'] / 1000.0) * 60.0)
        routings.append({
            'level': 'Level 2 (Core Moulding)',
            'matnr': c['part_id'],
            'desc': c['desc'],
            'plant': '1000',
            'vornr': '0010',
            'arbpl': 'WC046',
            'steus': 'ZP01',
            'ltxa1': 'MOULDING UNIMAT 22 E',
            'base_qty': 1,
            'meinh': 'PC',
            'val': calc_time,
            'unit': 'S',
            'calc_note': f"L={int(c['l'])} mm -> ({int(c['l'])}/1000)*60 = {calc_time} S"
        })

print("\nHASIL GENERASI ROUTING OTOMATIS OLEH SISTEM:")
print("=" * 80)
for idx, r in enumerate(routings, 1):
    note = f" | Kalkulasi: {r['calc_note']}" if 'calc_note' in r else ""
    alloc = f" | [{len(r['allocations'])} Hardware Allocated]" if 'allocations' in r else ""
    print(f"{idx:02d}. [{r['level']:<22}] Part {r['matnr']:<2} | Op {r['vornr']} | WC {r['arbpl']} ({r['ltxa1']:<20}) | Durasi: {r['val']:>3} {r['unit']}{note}{alloc}")

print("=" * 80)
print(f"TOTAL OPERASI ROUTING OTOMATIS TERBENTUK: {len(routings)} OPERASI")
print("Semua data siap dikirim langsung ke BAPI_ROUTING_CREATE tanpa perlu input manual!")
