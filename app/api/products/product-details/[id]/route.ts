import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const product = await db.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        orders: true,
      },
    });
    if (!product) {
      return NextResponse.json({ success: false, message: 'product not found' }, { status: 404 });
    }
    const orderCount = product.orders ? product.orders.length : 0;
    return NextResponse.json({ success: true, product: { ...product, orderCount } });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product details' }, { status: 500 });
  }
};
