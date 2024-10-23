import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const count = await db.product.count();

    return NextResponse.json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error('Error fetching products count:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products count' },
      { status: 500 }
    );
  }
};
