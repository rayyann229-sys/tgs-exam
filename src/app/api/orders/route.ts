import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Order } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const query = searchParams.get('q')?.toLowerCase();

  const db = getDb();
  let orders = db.orders;

  if (status && status !== 'All') {
    orders = orders.filter(o => o.status === status);
  }

  if (type && type !== 'All') {
    orders = orders.filter(o => o.orderType === type);
  }

  if (query) {
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query) ||
      (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(query))
    );
  }

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotal = body.items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
    const deliveryFee = body.orderType === 'Delivery' ? 100 : 0;
    const tax = 0; // standard 0 for local small eatery or included
    const totalAmount = subtotal + tax + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      customerName: body.customerName || 'Guest Customer',
      customerPhone: body.customerPhone || '+92 300 0000000',
      orderType: body.orderType || 'Takeaway',
      tableNumber: body.tableNumber,
      deliveryAddress: body.deliveryAddress,
      items: body.items,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      status: 'Pending',
      paymentMethod: body.paymentMethod || 'Cash',
      paymentStatus: body.paymentStatus || 'Pending',
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDb(db);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}
