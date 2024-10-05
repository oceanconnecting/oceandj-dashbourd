import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CategorySchema } from "@/schemas/category"; // Assuming you have a schema for validation

// Update category details
export const PUT = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Get category ID from query params

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Category ID is required' },
      { status: 400 }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    const { title, image } = CategorySchema.parse(body); // Validate the data

    // Check if the category exists
    const existingCategory = await db.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        image,
      },
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
      { status: 500 }
    );
  }
};
