import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const count = await db.order.count({
      where: {
        status: 'Reseved',
      },
    });

    return NextResponse.json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error('Error fetching reseved orders count:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reseved orders count' },
      { status: 500 }
    );
  }
};
