/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Order {
  items: any;
  id: number;
  name: string;
  reference: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  totalPrice?: string;
  createdAt: Date;
}

interface OrderItem {
  price: number;
  quantity: number;
  discount: number;
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
        createdAt: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    // Filter orders with status "Waiting" or "Delivered" and calculate totalPrice
    const ordersWithTotalPrice = orders.map(order => {
      // if (order.status === 'Waiting' || order.status === 'Delivered') {
        const totalPrice = order.items.reduce((total: number, item: OrderItem) => {
          const itemTotal = item.price * item.quantity * (1 - item.discount / 100);
          return total + itemTotal;
        }, 0);

        return {
          ...order,
          totalPrice: totalPrice.toFixed(2), // Round to 2 decimal places
        };
      // }

      // // Return the order without totalPrice if status is not "Waiting" or "Delivered"
      // return order;
    });

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      orders: ordersWithTotalPrice,
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
