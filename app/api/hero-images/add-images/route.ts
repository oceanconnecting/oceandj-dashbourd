import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadImageToStorage } from '@/firebase';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ success: false, message: 'Image file is required' }, { status: 400 });

    const url = await uploadImageToStorage(file);
    const newImage = await db.heroImages.create({ data: { url } });

    return NextResponse.json(newImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ success: false, message: 'Failed to upload image' }, { status: 500 });
  }
};
