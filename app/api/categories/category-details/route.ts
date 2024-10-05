import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
  }

  try {
    const category = await db.category.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' },{ status: 404 });
    }
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch category details' },
      { status: 500 }
    );
  }
};
