/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Product {
  id: number;
  categoryId: number;
  typeId: number | null;
}

interface OrdersPerType {
  typeId: number;
  orderCount: number;
  color: string;
}

export const GET = async () => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            typeId: true,
          },
        },
        orderItems: {
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          select: {
            id: true, // or any unique identifier for order items
          },
        },
      },
    });

    const productsWithOrderCount: Product[] = products.map((product: any) => ({
      id: product.id,
      categoryId: product.categoryId,
      typeId: product.category?.typeId || null,
    }));

    const ordersPerType: OrdersPerType[] = products.reduce((acc: OrdersPerType[], product: any) => {
      const typeId = product.category?.typeId;

      if (typeId !== null) {
        const orderCount = product.orderItems.length;

        const existingEntry = acc.find(entry => entry.typeId === typeId);

        if (existingEntry) {
          existingEntry.orderCount += orderCount;
        } else {
          const colorIndex = acc.length + 1;
          const color = `hsl(var(--color-type-${colorIndex}))`;

          acc.push({ typeId, orderCount, color });
        }
      }

      return acc;
    }, []);

    return NextResponse.json({
      success: true,
      ordersPerType,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
};
