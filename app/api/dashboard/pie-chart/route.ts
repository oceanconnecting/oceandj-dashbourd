/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Product {
  id: number;
  categoryId: number;
  typeId: number | null; // Allow typeId to be null
}

interface OrdersPerType {
  typeId: number;
  orderCount: number;
  color: string; // Add color field
}

export const GET = async () => {
  try {
    // Fetch products with their categories and order counts
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

    // Map products to include relevant fields
    const productsWithOrderCount: Product[] = products.map((product: any) => ({
      id: product.id,
      categoryId: product.categoryId,
      typeId: product.category?.typeId || null, // Handle potential null category
    }));

    // Aggregate orders per type and assign colors
    const ordersPerType: OrdersPerType[] = products.reduce((acc: OrdersPerType[], product: any) => {
      const typeId = product.category?.typeId;

      // Check if typeId is not null
      if (typeId !== null) {
        const existingEntry = acc.find(entry => entry.typeId === typeId);
        const orderCount = product._count.orderItems;

        if (existingEntry) {
          // If entry exists, sum the order counts
          existingEntry.orderCount += orderCount;
        } else {
          // Otherwise, create a new entry with a color
          const colorIndex = acc.length + 1; // Increment the color number starting from 1
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
