import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const images = await db.heroImages.findMany();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch images' }, { status: 500 });
  }
};
