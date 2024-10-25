/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Type {
  id: number;
  title: string;
}

interface Category {
  id: number;
  title: string;
  image: string;
  type: Type | null; // Keep type here as it's part of Category
}

interface Product {
  id: number;
  title: string;
  images: string[];
  categoryId: number;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: Category | null;
  orderCount: number;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  const sortParam = searchParams.get('sort') || 'title.asc';
  const [sortField, sortOrder] = sortParam.split('.');

  const validSortFields = ['title', 'id'];
  const validSortOrders = ['asc', 'desc'];

  if (!validSortFields.includes(sortField)) {
    return NextResponse.json(
      { success: false, message: 'Invalid sort field' },
      { status: 400 }
    );
  }

  if (!validSortOrders.includes(sortOrder)) {
    return NextResponse.json(
      { success: false, message: 'Invalid sort order' },
      { status: 400 }
    );
  }

  try {
    const totalProduct = await db.product.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    });

    const products = await db.product.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            image: true,
            type: {
              select: {
                id: true,   // Include only the id of type
                title: true, // Include only the title of type
              },
            },
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalProduct / limit);

    const productsWithOrderCount: Product[] = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      categoryId: product.categoryId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: {
        id: product.category?.id || 0,
        title: product.category?.title || '',
        image: product.category?.image || '',
        type: product.category?.type ? {
          id: product.category.type.id,
          title: product.category.type.title,
        } : null,
      },
      orderCount: product._count.orderItems,
    }));

    return NextResponse.json({
      success: true,
      products: productsWithOrderCount,
      total: totalProduct,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
};
