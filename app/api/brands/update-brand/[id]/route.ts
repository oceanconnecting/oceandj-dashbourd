import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { BrandSchema } from '@/schemas/brand';

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const brandId = params.id;
  try {
    const body = await req.json();
    const data = BrandSchema.parse(body);
    const updatedBrand = await db.brand.update({
      where: { title: brandId },
      data,
    });
    return NextResponse.json({ success: true, brand: updatedBrand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ success: false, message: 'Failed to update brand' }, { status: 500 });
  }
};
