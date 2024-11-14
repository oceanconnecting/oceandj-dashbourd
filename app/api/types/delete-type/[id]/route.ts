import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const type = await db.type.findUnique({ where: { title: id } });
    if (!type) {
      return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 });
    }

    await db.type.delete({
      where: {
        title: id,
      },
    });

    return NextResponse.json({ success: true, message: 'Type deleted successfully' });
  } catch (error) {
    console.error('Error deleting type:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete type' }, { status: 500 });
  }
};