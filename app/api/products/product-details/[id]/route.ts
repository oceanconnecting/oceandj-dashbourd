import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const product = await db.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        brand: {
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
      brandId: product.brandId,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
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
