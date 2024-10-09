import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { category: string } }) => {
  try {
    let { category } = params;

    // Replace '+' with spaces and make the search case-insensitive
    category = category.replace(/\+/g, ' ').toLowerCase();

    // Query the database for categories filtered by category (case-insensitive)
    const products = await db.product.findMany({
      where: {
        category: {
          title: {
            equals: category, // Ensure category title is compared case-insensitively
            mode: 'insensitive', // Case-insensitive search in Prisma
          },
        },
      },
      include: {
        category: true, // Include category information if needed
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching categories by category:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories by category' }, { status: 500 });
  }
};
