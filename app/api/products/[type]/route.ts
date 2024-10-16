import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { type: string } }) => {
  try {
    let { type } = params;

    type = type.replace(/\+/g, ' ').toLowerCase();

    const categories = await db.category.findMany({
      where: {
        type: {
          title: {
            equals: type,
            mode: 'insensitive',
          },
        },
      },
      include: {
        type: true,
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories by type' }, { status: 500 });
  }
};
