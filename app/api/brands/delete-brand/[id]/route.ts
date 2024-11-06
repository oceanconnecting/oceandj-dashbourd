import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const brand = await db.brand.findUnique({ where: { id: Number(id) } });
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
    }

    await db.brand.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete brand' }, { status: 500 });
  }
};