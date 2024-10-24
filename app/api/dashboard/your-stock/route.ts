import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const totalStock = await db.product.aggregate({
      _sum: {
        stock: true,
      },
    });

    return NextResponse.json({
      success: true,
      totalStock: totalStock._sum.stock || 0,
    });
  } catch (error) {
    console.error('Error fetching total stock:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch total stock' },
      { status: 500 }
    );
  }
};
