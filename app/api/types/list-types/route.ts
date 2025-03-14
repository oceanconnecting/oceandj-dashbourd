import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Type {
  id: string;
  title: string;
  image: string;
  _count: {
    categories: number;
  };
  categories: {
    _count: {
      products: number;
    };
  }[];
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
    const totalTypes = await db.type.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    });

    const types: Type[] = await db.type.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        _count: {
          select: {
            categories: true,
          },
        },
        categories: {
          select: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
      },
      take: isLimitAll ? totalTypes : limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = isLimitAll ? 1 : Math.ceil(totalTypes / (limit ?? 1));

    const typesWithCounts = types.map((type: Type) => {
      const productCount = type.categories.reduce((sum, category) => {
        return sum + category._count.products;
      }, 0);

      return {
        id: type.id,
        title: type.title,
        image: type.image,
        categoryCount: type._count.categories,
        productCount: productCount,
      };
    });

    return NextResponse.json({
      success: true,
      types: typesWithCounts,
      total: totalTypes,
      page,
      limit: isLimitAll ? totalTypes : limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch types' },
      { status: 500 }
    );
  }
};