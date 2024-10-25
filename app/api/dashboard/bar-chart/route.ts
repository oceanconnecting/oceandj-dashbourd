import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const ordersPerMonth = await db.order.groupBy({
      by: ['createdAt'],
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyOrderCountMap = new Map();

    ordersPerMonth.forEach(order => {
      const month = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const count = order._count.id;

      if (monthlyOrderCountMap.has(month)) {
        monthlyOrderCountMap.set(month, monthlyOrderCountMap.get(month) + count);
      } else {
        monthlyOrderCountMap.set(month, count);
      }
    });

    const monthlyOrderCount = Array.from(monthlyOrderCountMap.entries()).map(([month, totalOrders]) => ({
      month,
      totalOrders,
    }));

    return NextResponse.json({
      success: true,
      monthlyOrderCount,
    });
  } catch (error) {
    console.error('Error fetching monthly orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch monthly orders' },
      { status: 500 }
    );
  }
};