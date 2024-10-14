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

    const validIds = ids.map(Number).filter((id) => !isNaN(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid numeric IDs provided' },
        { status: 400 }
      );
    }

    const existingProducts = await db.product.findMany({
      where: {
        id: { in: validIds },
      },
    });

    if (existingProducts.length !== validIds.length) {
      return NextResponse.json(
        { success: false, message: 'Some products not found' },
        { status: 404 }
      );
    }

    await db.product.deleteMany({
      where: {
        id: { in: validIds },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Products deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete products' },
      { status: 500 }
    );
  }
};
