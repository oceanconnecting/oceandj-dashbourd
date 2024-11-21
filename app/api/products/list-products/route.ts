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
  dateAdded: Date;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = searchParams.get('limit') || '10';
  const isLimitAll = limitParam === 'all';
  const limit = isLimitAll ? undefined : parseInt(limitParam, 10);
  const offset = isLimitAll ? 0 : (page - 1) * (limit ?? 1);

  const sortParam = searchParams.get('sort') || 'dateAdded.desc';
  const [sortField, sortOrder] = sortParam.split('.');

  const typeId = searchParams.get('typeId');
  const brandId = searchParams.get('brandId');
  const categoryId = searchParams.get('categoryId');

  const validSortFields = [
    'title',
    'id',
    'price',
    'discount',
    'stock',
    'orderCount',
    'dateAdded',
  ];
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
    // Fetch all products first
    const rawProducts = await db.product.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        categoryId: categoryId || undefined,
        category: {
          type: typeId ? { id: typeId } : undefined,
        },
        brandId: brandId || undefined,
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
    });

    // Map products to include custom fields like `orderCount`
    const mappedProducts: Product[] = rawProducts.map((product: any) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      categoryId: product.categoryId,
      brandId: product.brandId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      dateAdded: product.dateAdded,
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

    // Sort products dynamically by the selected field
    mappedProducts.sort((a, b) => {
      const valueA = (a as any)[sortField];
      const valueB = (b as any)[sortField];

      // Handle ascending or descending order
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortOrder === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }
      return sortOrder === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    // Paginate the sorted products
    const paginatedProducts = isLimitAll
      ? mappedProducts
      : mappedProducts.slice(offset, offset + (limit ?? mappedProducts.length));

    const totalPages = isLimitAll
      ? 1
      : Math.ceil(mappedProducts.length / (limit ?? 1));

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total: mappedProducts.length,
      page,
      limit: isLimitAll ? mappedProducts.length : limit,
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