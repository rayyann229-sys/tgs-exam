import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { StaffMember } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.staff);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newStaff: StaffMember = {
      id: `STF-${Math.floor(10 + Math.random() * 90)}`,
      name: body.name,
      role: body.role,
      phone: body.phone,
      email: body.email,
      salary: Number(body.salary || 30000),
      status: body.status || 'Active',
      shift: body.shift || 'Evening',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    db.staff.unshift(newStaff);
    saveDb(db);

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 400 });
  }
}
