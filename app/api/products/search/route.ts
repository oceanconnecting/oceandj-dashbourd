import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request) => {
  try {
    // Parse the request URL to access the search params
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('s') || '';

    // Check if searchTerm exists
    if (!searchTerm) {
      return NextResponse.json({ success: false, message: 'Search term is required' }, { status: 400 });
    }

    // Query the database for products with matching title or description
    const products = await db.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          // {
          //   description: {
          //     contains: searchTerm,
          //     mode: 'insensitive',
          //   },
          // },
        ],
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to search products' }, { status: 500 });
  }
};
