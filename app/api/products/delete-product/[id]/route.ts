import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Check if the product exists
    const product = await db.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Delete the product
    await db.product.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
};
