import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const brand = await db.brand.findUnique({
      where: {
        title: id,
      },
      include: {
        products: true,
      },
    });
    if (!brand) {
      return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
    }
    const productCount = brand.products ? brand.products.length : 0;
    return NextResponse.json({ success: true, brand: { ...brand, productCount } });
  } catch (error) {
    console.error('Error fetching brand details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch brand details' }, { status: 500 });
  }
};