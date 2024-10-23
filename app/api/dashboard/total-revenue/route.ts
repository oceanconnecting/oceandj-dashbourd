import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface OrderItem {
  price: number;
  quantity: number;
  discount: number | null;
}

export const GET = async () => {
  try {
    const allOrders = await db.order.findMany({
      select: {
        items: true,
      },
    });

    const totalSum = allOrders.reduce((sum, order) => {
      const orderTotalPrice = order.items.reduce((total: number, item: OrderItem) => {
        const discount = item.discount ?? 0;
        const itemTotal = item.price * item.quantity * (1 - discount / 100);
        return total + itemTotal;
      }, 0);

      return sum + orderTotalPrice;
    }, 0);

    return NextResponse.json({
      success: true,
      totalSum: totalSum.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to calculate sum of orders' },
      { status: 500 }
    );
  }
};
