import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Category {
  id: string;
  title: string;
  image: string;
  typeId: string;
  _count: {
    products: number;
  };
  type: {
    id: string;
    title: string;
    image: string;
  } | null;
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

  const typeId = searchParams.get('typeId'); // Extract typeId from query parameters

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
    const totalCategory = await db.category.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        typeId: typeId ? typeId : undefined, // Apply typeId filter if present
      },
    });

    const categories: Category[] = await db.category.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        typeId: typeId ? typeId : undefined, 
      },
      include: {
        type: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      take: isLimitAll ? totalCategory : limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = isLimitAll ? 1 : Math.ceil(totalCategory / (limit ?? 1));

    const categoriesWithProductCount = categories.map((category: Category) => ({
      id: category.id,
      title: category.title,
      image: category.image,
      typeId: category.typeId,
      productCount: category._count.products,
      type: category.type,
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithProductCount,
      total: totalCategory,
      page,
      limit: isLimitAll ? totalCategory : limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
};
