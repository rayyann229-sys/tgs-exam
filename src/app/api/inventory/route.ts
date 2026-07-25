import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { InventoryItem } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.inventory);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newItem: InventoryItem = {
      id: `INV-${Math.floor(10 + Math.random() * 90)}`,
      itemName: body.itemName,
      category: body.category,
      quantity: Number(body.quantity || 0),
      unit: body.unit || 'kg',
      minThreshold: Number(body.minThreshold || 5),
      costPerUnit: Number(body.costPerUnit || 100),
      supplier: body.supplier || 'Local Market',
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    db.inventory.unshift(newItem);
    saveDb(db);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 400 });
  }
}
