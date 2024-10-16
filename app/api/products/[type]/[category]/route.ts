import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { category: string } }) => {
  try {
    let { category } = params;

    category = category.replace(/\+/g, ' ').toLowerCase();

    const products = await db.product.findMany({
      where: {
        category: {
          title: {
            equals: category, 
            mode: 'insensitive',
          },
        },
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching categories by category:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories by category' }, { status: 500 });
  }
};
