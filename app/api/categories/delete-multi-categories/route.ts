import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

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

    // Convert ids to numbers and filter out invalid values
    const validIds = ids.map(Number).filter((id) => !isNaN(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid numeric IDs provided' },
        { status: 400 }
      );
    }

    // Find the existing categories
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

    // Delete the categories
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
