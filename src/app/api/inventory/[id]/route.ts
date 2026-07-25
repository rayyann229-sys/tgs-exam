import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.inventory.findIndex(i => i.id === id);
    if (index === -1) return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });

    db.inventory[index] = {
      ...db.inventory[index],
      ...body,
      lastRestocked: body.quantity !== undefined ? new Date().toISOString().split('T')[0] : db.inventory[index].lastRestocked
    };

    saveDb(db);
    return NextResponse.json(db.inventory[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.inventory.length;
  db.inventory = db.inventory.filter(i => i.id !== id);

  if (db.inventory.length === initialLen) {
    return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
