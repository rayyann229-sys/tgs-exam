import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const item = db.menuItems.find(i => i.id === id);
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.menuItems.findIndex(i => i.id === id);
    if (index === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    db.menuItems[index] = {
      ...db.menuItems[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    saveDb(db);
    return NextResponse.json(db.menuItems[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.menuItems.length;
  db.menuItems = db.menuItems.filter(i => i.id !== id);

  if (db.menuItems.length === initialLen) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
