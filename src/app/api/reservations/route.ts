import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Reservation } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.reservations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newRes: Reservation = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      guestCount: Number(body.guestCount || 2),
      reservationDate: body.reservationDate,
      reservationTime: body.reservationTime,
      seatingArea: body.seatingArea || 'Main Hall',
      specialRequests: body.specialRequests || '',
      status: 'Confirmed',
      tableNumber: body.tableNumber || 'TBD',
      createdAt: new Date().toISOString()
    };

    db.reservations.unshift(newRes);
    saveDb(db);

    return NextResponse.json(newRes, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 400 });
  }
}
