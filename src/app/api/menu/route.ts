import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { MenuItem } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  const db = getDb();
  let items = db.menuItems;

  if (category && category !== 'All') {
    items = items.filter(i => i.category === category);
  }

  if (query) {
    items = items.filter(i => 
      i.name.toLowerCase().includes(query) || 
      i.description.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();
    
    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      image: body.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
      isAvailable: body.isAvailable ?? true,
      isBestseller: body.isBestseller ?? false,
      spicyLevel: Number(body.spicyLevel || 0),
      preparationTime: Number(body.preparationTime || 15),
      addons: body.addons || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.menuItems.unshift(newItem);
    saveDb(db);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 400 });
  }
}
