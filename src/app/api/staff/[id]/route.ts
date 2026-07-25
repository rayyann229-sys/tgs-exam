import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.staff.findIndex(s => s.id === id);
    if (index === -1) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });

    db.staff[index] = {
      ...db.staff[index],
      ...body
    };

    saveDb(db);
    return NextResponse.json(db.staff[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.staff.length;
  db.staff = db.staff.filter(s => s.id !== id);

  if (db.staff.length === initialLen) {
    return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
