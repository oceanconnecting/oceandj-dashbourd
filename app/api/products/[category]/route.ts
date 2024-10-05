import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { category: string } }) => {
  const { category } = params;

  if (!category) {
    return NextResponse.json({ success: false, message: 'Category is required' }, { status: 400 });
  }

  try {
    // Find the category by its title
    const foundCategory = await db.category.findFirst({
      where: {
        title: {
          equals: category, // Ensure case-insensitive matching if needed
          mode: 'insensitive', // Make it case-insensitive
        },
      },
    });

    // If the category doesn't exist, return a 404
    if (!foundCategory) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    // Find products belonging to the found category
    const products = await db.product.findMany({
      where: {
        categoryId: foundCategory.id,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error filtering products by category:', error);
    return NextResponse.json({ success: false, message: 'Failed to filter products by category' }, { status: 500 });
  }
};
