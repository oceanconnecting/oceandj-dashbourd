import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Order {
  id: number;
  name: string;
  reference: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;

  const sortParam = searchParams.get('sort') || 'name.asc';
  const [sortField, sortOrder] = sortParam.split('.');

  const validSortFields = ['name', 'email', 'id'];
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
    const totalOrders = await db.order.count({
      where: {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    });

    const orders: Order[] = await db.order.findMany({
      where: {
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        reference: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        status: true,
        items: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      orders,
      total: totalOrders,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
};