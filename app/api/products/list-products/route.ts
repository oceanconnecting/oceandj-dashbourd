/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Type {
  id: string;
  title: string;
}

interface Category {
  id: string;
  title: string;
  image: string;
  type: Type | null;
}

interface Brand {
  id: string;
  title: string;
  image: string;
}

interface Product {
  id: string;
  title: string;
  images: string[];
  categoryId: string;
  brandId: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: Category | null;
  brand: Brand | null;
  orderCount: number;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = searchParams.get('limit') || '10';
  const isLimitAll = limitParam === 'all';
  const limit = isLimitAll ? undefined : parseInt(limitParam, 10);
  const offset = isLimitAll ? 0 : (page - 1) * (limit ?? 1);

  const sortParam = searchParams.get('sort') || 'title.asc';
  const [sortField, sortOrder] = sortParam.split('.');

  const typeId = searchParams.get('typeId');
  const brandId = searchParams.get('brandId');
  const categoryId = searchParams.get('categoryId');

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
    // Get the total count of products
    const totalProduct = await db.product.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        categoryId: categoryId ? categoryId : undefined,
        category: {
          type: typeId ? { id: typeId } : undefined,
        },
        brandId: brandId ? brandId : undefined,
      },
    });

    const products = await db.product.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        categoryId: categoryId ? categoryId : undefined,
        category: {
          type: typeId ? { id: typeId } : undefined,
        },
        brandId: brandId ? brandId : undefined,
      },
      include: {
        brand: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
            image: true,
            type: {
              select: {
                id: true,
                title: true,
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
      take: isLimitAll ? totalProduct : limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = isLimitAll ? 1 : Math.ceil(totalProduct / (limit ?? 1));

    const productsWithOrderCount: Product[] = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      categoryId: product.categoryId,
      brandId: product.brandId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      brand: {
        id: product.brand?.id || '',
        title: product.brand?.title || '',
        image: product.brand?.image || '',
      },
      category: {
        id: product.category?.id || '',
        title: product.category?.title || '',
        image: product.category?.image || '',
        type: product.category?.type
          ? {
              id: product.category.type.id,
              title: product.category.type.title,
            }
          : null,
      },
      orderCount: product._count.orderItems,
    }));

    return NextResponse.json({
      success: true,
      products: productsWithOrderCount,
      total: totalProduct,
      page,
      limit: isLimitAll ? totalProduct : limit,
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
