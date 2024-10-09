import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const categories = await db.category.findMany({
      include: {
        type: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const categoriesWithProductCount = categories.map(category => ({
      id: category.id,
      title: category.title,
      image: category.image,
      typeId: category.typeId,
      productCount: category._count.products,
      type: category.type, // Include type data if needed
    }));

    return NextResponse.json({ success: true, categories: categoriesWithProductCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
};
