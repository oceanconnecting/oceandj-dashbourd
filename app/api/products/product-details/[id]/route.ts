import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const productId = parseInt(params.id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const productDetails = {
      id: product.id,
      title: product.title,
      images: product.images,
      categoryId: product.categoryId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      orderCount: product._count.orderItems,
    };

    return NextResponse.json({ success: true, product: productDetails });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
};
