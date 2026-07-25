import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.reservations.findIndex(r => r.id === id);
    if (index === -1) return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });

    db.reservations[index] = {
      ...db.reservations[index],
      ...body
    };

    saveDb(db);
    return NextResponse.json(db.reservations[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.reservations.length;
  db.reservations = db.reservations.filter(r => r.id !== id);

  if (db.reservations.length === initialLen) {
    return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
