import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Brand {
  id: number;
  title: string;
  image: string;
  _count: {
    products: number;
  };
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
    const totalBrands = await db.brand.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    });

    const brands: Brand[] = await db.brand.findMany({
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
            products: true,
          },
        },
      },
      take: isLimitAll ? totalBrands : limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = isLimitAll ? 1 : Math.ceil(totalBrands / (limit ?? 1));

    const brandsWithProductCount = brands.map((brand: Brand) => ({
      id: brand.id,
      title: brand.title,
      image: brand.image,
      productCount: brand._count.products,
    }));

    return NextResponse.json({
      success: true,
      brands: brandsWithProductCount,
      total: totalBrands,
      page,
      limit: isLimitAll ? totalBrands : limit,
      totalPages,
    });    
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
};
