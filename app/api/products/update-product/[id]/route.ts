import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProductSchema } from "@/schemas/product";

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    
    const body = await req.json();
    const { title, images, categoryId, brandId, description, price, discount, stock } = ProductSchema.parse(body);

    const updatedProduct = await db.product.update({
      where: { title: id },
      data: {
        title,
        images,
        categoryId,
        brandId,
        description,
        price: Math.floor(price),
        discount: discount ?? 0,
        stock: Math.floor(stock),
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
};