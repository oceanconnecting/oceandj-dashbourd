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
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            typeId: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
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
        const existingEntry = acc.find(entry => entry.typeId === typeId);
        const orderCount = product._count.orderItems;

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