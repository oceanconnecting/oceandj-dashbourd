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
      take: limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalBrands = await db.brand.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    });

    const totalPages = Math.ceil(totalBrands / limit);

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
      limit,
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
