import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid IDs provided' },
        { status: 400 }
      );
    }

    const validIds = ids.map(String).filter((id) => id);

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid numeric IDs provided' },
        { status: 400 }
      );
    }

    const existingCategories = await db.category.findMany({
      where: {
        id: { in: validIds },
      },
    });

    if (existingCategories.length !== validIds.length) {
      return NextResponse.json(
        { success: false, message: 'Some categories not found' },
        { status: 404 }
      );
    }

    await db.category.deleteMany({
      where: {
        id: { in: validIds },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Categories deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete categories' },
      { status: 500 }
    );
  }
};
