import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { ProductSchema } from "@/schemas/product";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, images, categoryId, brandId, description, price, discount, stock } = ProductSchema.parse(body);

    if (!title || !images || !categoryId || !brandId || !description || !price || !discount || !stock) {
      return NextResponse.json({ success: false, message: 'Title, images, categoryId, description, price, discount, and stock are required' }, { status: 400 });
    }

    const newProduct = await db.product.create({
      data: {
        title,
        images,
        categoryId,
        brandId,
        description,
        price,
        discount: discount ?? 0,
        stock,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, message: 'Failed to add product' }, { status: 500 });
  }
};