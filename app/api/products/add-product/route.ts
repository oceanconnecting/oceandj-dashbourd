import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config
import { ProductSchema } from '@/schemas/product';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, description, images, price, discount, stock, categoryId } = ProductSchema.parse(body);

    // Add the product to the database
    const newProduct = await db.product.create({
      data: {
        title,
        description,
        images,
        price,
        discount: discount ?? 0, // Default to 0 if discount is not provided
        stock,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, message: 'Failed to add product' }, { status: 500 });
  }
};
