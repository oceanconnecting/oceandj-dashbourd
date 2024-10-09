import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CategorySchema } from '@/schemas/category';

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const categoryId = parseInt(params.id, 10);

  try {
    const body = await req.json();
    const data = CategorySchema.parse(body);

    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data,
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, message: 'Failed to update category' }, { status: 500 });
  }
};
