import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const DELETE = async (req: Request) => {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
    }

    await db.heroImages.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete images' }, { status: 500 });
  }
};
