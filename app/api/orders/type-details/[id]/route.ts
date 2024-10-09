import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Find type by id
    const type = await db.type.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!type) {
      return NextResponse.json({ success: false, message: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, type });
  } catch (error) {
    console.error('Error fetching type details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch type details' }, { status: 500 });
  }
};
