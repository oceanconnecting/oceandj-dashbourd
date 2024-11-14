import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TypeSchema } from '@/schemas/type';

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const typeId = params.id;
  try {
    const body = await req.json();
    const data = TypeSchema.parse(body);
    const updatedType = await db.type.update({
      where: { title: typeId },
      data,
    });
    return NextResponse.json({ success: true, type: updatedType });
  } catch (error) {
    console.error('Error updating type:', error);
    return NextResponse.json({ success: false, message: 'Failed to update type' }, { status: 500 });
  }
};
