import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { Review } from '@/lib/types';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.reviews);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const newReview: Review = {
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName || 'Anonymous Foodie',
      rating: Number(body.rating || 5),
      reviewText: body.reviewText,
      favoriteItem: body.favoriteItem || '',
      verifiedPurchase: body.verifiedPurchase ?? true,
      status: 'Published',
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);
    saveDb(db);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 400 });
  }
}
