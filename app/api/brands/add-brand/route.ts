import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { BrandSchema } from "@/schemas/brand";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, image } = BrandSchema.parse(body); 

    if (!title || !image) {
      return NextResponse.json({ success: false, message: 'Title and image are required' }, { status: 400 });
    }

    const newBrand = await db.brand.create({
      data: {
        title,
        image,
      },
    });

    return NextResponse.json({ success: true, brand: newBrand });
  } catch (error) {
    console.error('Error adding brand:', error);
    return NextResponse.json({ success: false, message: 'Failed to add brand' }, { status: 500 });
  }
};
