import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const StatusSchema = z.object({
  status: z.enum(['Waiting', 'Cancelled', 'Reserved']).optional(),
});

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (status) {
      StatusSchema.parse({ status });
    }

    const existingOrder = await db.order.findUnique({
      where: { id: Number(id) },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (status) {
      const updatedOrder = await db.order.update({
        where: { id: Number(id) },
        data: { status },
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'No status provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order status';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
};