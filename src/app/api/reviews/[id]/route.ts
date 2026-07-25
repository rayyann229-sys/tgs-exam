import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.reviews.findIndex(r => r.id === id);
    if (index === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    db.reviews[index] = {
      ...db.reviews[index],
      ...body
    };

    saveDb(db);
    return NextResponse.json(db.reviews[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.reviews.length;
  db.reviews = db.reviews.filter(r => r.id !== id);

  if (db.reviews.length === initialLen) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
