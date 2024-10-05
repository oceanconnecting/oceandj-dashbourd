import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Find product by id
    const product = await db.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        category: true, // Include category details in the product response
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch product details' }, { status: 500 });
  }
};
