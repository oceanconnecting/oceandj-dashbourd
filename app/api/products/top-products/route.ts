/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Product {
  id: number;
  title: string;
  images: string[];
  categoryId: number;
  brandId: number;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: {
    id: number;
    title: string;
    image: string;
  } | null;
  brand: {
    id: number;
    title: string;
    image: string;
  } | null;
  orderCount: number;
}

export const GET = async () => {
  try {
    const products = await db.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        brand: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    const sortedProducts = products.sort((a: any, b: any) => 
      b._count.orderItems - a._count.orderItems
    );

    const topProducts: Product[] = sortedProducts.slice(0, 5).map((product: any) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      categoryId: product.categoryId,
      brandId: product.brandId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      orderCount: product._count.orderItems,
    }));

    return NextResponse.json({
      success: true,
      products: topProducts,
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch top products' },
      { status: 500 }
    );
  }
};
