import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const order = await db.order.findUnique({
      where: {
        reference: id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch order details' }, { status: 500 });
  }
};
