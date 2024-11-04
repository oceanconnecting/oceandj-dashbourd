import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Category {
  id: number;
  title: string;
  image: string;
  typeId: number;
  _count: {
    products: number;
  };
  type: {
    id: number;
    title: string;
    image: string;
  } | null;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

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
        typeId: typeId ? parseInt(typeId, 10) : undefined, // Apply typeId filter if present
      },
    });

    const categories: Category[] = await db.category.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
        typeId: typeId ? parseInt(typeId, 10) : undefined, // Apply typeId filter if present
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
      take: limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalCategory / limit);

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
      limit,
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
