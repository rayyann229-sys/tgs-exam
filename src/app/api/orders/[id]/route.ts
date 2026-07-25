import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const order = db.orders.find(o => o.id === id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    const index = db.orders.findIndex(o => o.id === id);
    if (index === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    db.orders[index] = {
      ...db.orders[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    saveDb(db);
    return NextResponse.json(db.orders[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const initialLen = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== id);

  if (db.orders.length === initialLen) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  saveDb(db);
  return NextResponse.json({ success: true });
}
