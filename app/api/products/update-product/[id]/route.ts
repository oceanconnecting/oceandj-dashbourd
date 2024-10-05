import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProductSchema } from '@/schemas/product';

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const productId = parseInt(params.id, 10);

  try {
    const body = await req.json();
    const data = ProductSchema.parse(body);

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
};
