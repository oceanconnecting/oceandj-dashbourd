import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Find category by id
    const category = await db.category.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        type: true, // Include category details in the category response
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    // Calculate category count
    const productCount = category.products ? category.products.length : 0;

    return NextResponse.json({ success: true, category: { ...category, productCount } });
  } catch (error) {
    console.error('Error fetching category details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch category details' }, { status: 500 });
  }
};
