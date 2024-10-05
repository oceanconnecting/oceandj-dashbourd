import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 

export const GET = async () => {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
};