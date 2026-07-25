import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    const db = getDb();

    // If role requested directly (for quick role switcher)
    if (role) {
      const user = db.users.find(u => u.role === role) || db.users[0];
      return NextResponse.json({ success: true, user });
    }

    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      // Fallback for custom user login
      const newUser = {
        id: `usr_${Date.now()}`,
        email: email || 'user@ifficafe.pk',
        name: email ? email.split('@')[0] : 'Cafe Guest',
        role: 'customer' as const,
        phone: '+92 300 1234567',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
      };
      return NextResponse.json({ success: true, user: newUser });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }
}
