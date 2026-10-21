import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MDG_DATA_DIR = path.join(process.cwd(), 'public', 'project', 'MDG', 'data');
const FALLBACK_DATA_DIR = path.join(process.cwd(), 'public', 'project', 'MASTER DATA GOVERNANCE', 'data');
const DATA_DIR = fs.existsSync(MDG_DATA_DIR) ? MDG_DATA_DIR : FALLBACK_DATA_DIR;

const ALLOWED_FILES: Record<string, string> = {
  users: 'users.json',
  materials: 'materials.json',
  business_partners: 'business_partners.json',
  info_records: 'info_records.json',
  staging_material: 'staging_material.json',
  staging_bp: 'staging_bp.json',
  staging_pir: 'staging_pir.json',
  staging_parts: 'staging_parts.json'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('file');

    if (!fileKey || !ALLOWED_FILES[fileKey]) {
      // return list of available endpoints/files
      return NextResponse.json({
        status: 'OK',
        message: 'SAP MDG Standalone Local API Running',
        availableFiles: Object.keys(ALLOWED_FILES)
      });
    }

    const filePath = path.join(DATA_DIR, ALLOWED_FILES[fileKey]);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `File not found: ${fileKey}` }, { status: 404 });
    }

    const raw = fs.readFileSync(filePath, 'utf8').trim();
    if (!raw) {
      return NextResponse.json([]);
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      console.warn(`[API /api/mdg] Malformed JSON in ${fileKey}, returning empty array:`, parseErr);
      return NextResponse.json([]);
    }
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, data, action } = body;

    if (!file || !ALLOWED_FILES[file]) {
      return NextResponse.json({ error: 'Invalid or missing file identifier' }, { status: 400 });
    }

    if (data === undefined) {
      return NextResponse.json({ error: 'Missing data payload' }, { status: 400 });
    }

    const filePath = path.join(DATA_DIR, ALLOWED_FILES[file]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({
      status: 'SUCCESS',
      message: `File ${ALLOWED_FILES[file]} successfully updated and persisted on disk`,
      action: action || 'SAVE'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
