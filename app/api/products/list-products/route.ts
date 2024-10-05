import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path to your db config

export const GET = async (req: Request) => {
  try {
    // Parse query params for pagination (optional)
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 products per page
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await db.product.findMany({
      skip,
      take: limit,
      include: {
        category: true, // Include category details in the product list
      },
    });

    // Get total number of products for pagination info
    const totalProducts = await db.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        totalPages,
        totalProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
};
