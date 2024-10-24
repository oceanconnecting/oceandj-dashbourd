import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const resevedOrders = await db.order.findMany({
      where: {
        status: 'Reseved',
      },
      include: {
        items: true,
      },
    });

    const totalProducts = resevedOrders.reduce((total, order) => {
      const orderTotal = order.items.reduce((sum, item) => sum + item.quantity, 0);
      return total + orderTotal;
    }, 0);

    return NextResponse.json({
      success: true,
      totalProducts: totalProducts,
    });
  } catch (error) {
    console.error('Error fetching reseved orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reseved orders' },
      { status: 500 }
    );
  }
};
