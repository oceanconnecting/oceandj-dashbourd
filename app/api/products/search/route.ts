/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request) => {
  try {
    // Parse the request URL to access the search params
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('s') || '';
    const typeId = url.searchParams.get('type'); // Filter for type
    const categoryId = url.searchParams.get('category'); // Filter for category

    // Check if searchTerm exists
    if (!searchTerm) {
      return NextResponse.json({ success: false, message: 'Search term is required' }, { status: 400 });
    }

    // Build the where clause for filtering
    const whereClause: any = {
      AND: [
        {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive', // Case-insensitive search
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive', // Case-insensitive search for description
              },
            },
          ],
        },
      ],
    };

    // Add filtering by category if categoryId is provided
    if (categoryId) {
      whereClause.AND.push({
        categoryId: Number(categoryId),
      });
    }

    // Add filtering by type through the category relation if typeId is provided
    if (typeId) {
      whereClause.AND.push({
        category: {
          typeId: Number(typeId), // Assuming 'typeId' exists in the 'category' model
        },
      });
    }

    // Query the database for products with matching filters
    const products = await db.product.findMany({
      where: whereClause,
      include: {
        category: true, // Ensure that category is included if needed in response
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ success: false, message: 'Failed to search products' }, { status: 500 });
  }
};
