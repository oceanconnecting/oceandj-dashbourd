import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export const GET = async () => {
  try {
    const types = await db.type.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    return NextResponse.json({ success: true, types });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch types' },
      { status: 500 }
    );
  }
};