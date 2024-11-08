import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Find the order by its ID and include its items
    const order = await db.order.findUnique({
      where: { id: Number(id) },
      include: { items: true }, // Include related order items
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Revert the stock for each product in the order
    for (const item of order.items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ success: false, message: `Product with id ${item.productId} not found` }, { status: 404 });
      }

      // Increase the stock based on the order item quantity
      await db.product.update({
        where: { id: item.productId },
        data: { stock: product.stock + item.quantity },
      });
    }

    // Delete the order
    await db.order.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 });
  }
};
