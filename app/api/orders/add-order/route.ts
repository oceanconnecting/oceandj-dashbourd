import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { TypeSchema } from "@/schemas/type";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, image } = TypeSchema.parse(body); 

    if (!title || !image) {
      return NextResponse.json({ success: false, message: 'Title and image are required' }, { status: 400 });
    }

    const newType = await db.type.create({
      data: {
        title,
        image,
      },
    });

    return NextResponse.json({ success: true, type: newType });
  } catch (error) {
    console.error('Error adding type:', error);
    return NextResponse.json({ success: false, message: 'Failed to add type' }, { status: 500 });
  }
};
