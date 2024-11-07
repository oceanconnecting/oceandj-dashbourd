import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const count = await db.order.count({
      where: {
        status: 'Delivered',
      },
    });

    return NextResponse.json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error('Error fetching Delivered orders count:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Delivered orders count' },
      { status: 500 }
    );
  }
};
