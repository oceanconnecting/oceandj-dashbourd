import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { type: string } }) => {
  try {
    let { type } = params;

    // Replace '+' with spaces and make the search case-insensitive
    type = type.replace(/\+/g, ' ').toLowerCase();

    // Query the database for categories filtered by type (case-insensitive)
    const categories = await db.category.findMany({
      where: {
        type: {
          title: {
            equals: type, // Ensure type title is compared case-insensitively
            mode: 'insensitive', // Case-insensitive search in Prisma
          },
        },
      },
      include: {
        type: true, // Include type information if needed
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories by type' }, { status: 500 });
  }
};
