import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const type = await db.type.findUnique({
      where: {
        title: id,
      },
      include: {
        categories: true,
      },
    });
    if (!type) {
      return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 });
    }
    const categoryCount = type.categories ? type.categories.length : 0;
    return NextResponse.json({ success: true, type: { ...type, categoryCount } });
  } catch (error) {
    console.error('Error fetching type details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch type details' }, { status: 500 });
  }
};
