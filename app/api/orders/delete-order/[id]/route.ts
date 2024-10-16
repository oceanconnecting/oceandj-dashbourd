import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const order = await db.order.findUnique({ where: { id: Number(id) } });
    if (!order) {
      return NextResponse.json({ success: false, message: 'order not found' }, { status: 404 });
    }

    await db.order.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true, message: 'order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 });
  }
};