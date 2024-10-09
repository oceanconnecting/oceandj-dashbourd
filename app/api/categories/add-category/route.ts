import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { CategorySchema } from "@/schemas/category";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, image, typeId } = CategorySchema.parse(body); 

    if ( !title || !image || !typeId ) {
      return NextResponse.json({ success: false, message: 'Title and image and type are required' }, { status: 400 });
    }

    const newCategory = await db.category.create({
      data: {
        title,
        image,
        typeId,
      },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ success: false, message: 'Failed to add category' }, { status: 500 });
  }
};
