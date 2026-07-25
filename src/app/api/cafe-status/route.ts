import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.cafeInfo);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    db.cafeInfo = {
      ...db.cafeInfo,
      ...body
    };
    saveDb(db);
    return NextResponse.json({ success: true, cafeInfo: db.cafeInfo });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cafe status' }, { status: 400 });
  }
}
