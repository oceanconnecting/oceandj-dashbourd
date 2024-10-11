import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Define an interface for the type object
interface Type {
  id: number;
  title: string;
  image: string;
  _count: {
    categories: number;
  };
}

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit; // Calculate offset for pagination

  // Get the sorting parameters
  const sortParam = searchParams.get('sort') || 'title.asc'; // Default sort by title ascending
  const [sortField, sortOrder] = sortParam.split('.'); // Split sortParam into field and order

  // Validate sortField and sortOrder
  const validSortFields = ['title', 'id']; // Remove 'categoryCount' from sorting fields
  const validSortOrders = ['asc', 'desc'];

  if (!validSortFields.includes(sortField)) {
    return NextResponse.json(
      { success: false, message: 'Invalid sort field' },
      { status: 400 }
    );
  }

  if (!validSortOrders.includes(sortOrder)) {
    return NextResponse.json(
      { success: false, message: 'Invalid sort order' },
      { status: 400 }
    );
  }

  try {
    // Fetch types along with their category counts with pagination
    const types: Type[] = await db.type.findMany({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive', // Optional: make search case-insensitive
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        _count: {
          select: {
            categories: true, // Change 'categories' to the actual name of the relation
          },
        },
      },
      take: limit, // Limit the number of results returned
      skip: offset, // Skip the records based on the current page
      orderBy: {
        [sortField]: sortOrder, // Dynamic sorting for other fields
      },
    });

    // Count the total number of records that match the search query
    const totalTypes = await db.type.count({
      where: {
        title: {
          contains: searchQuery,
          mode: 'insensitive', // Optional: make count case-insensitive
        },
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalTypes / limit); // Calculate total pages

    // Map the types to include categoryCount
    const typesWithCategoryCount = types.map((type: Type) => ({
      id: type.id,
      title: type.title,
      image: type.image,
      categoryCount: type._count.categories, // Access the count from the fetched data
    }));

    return NextResponse.json({
      success: true,
      types: typesWithCategoryCount,
      total: totalTypes, // Include total count for pagination
      page,
      limit,
      totalPages, // Return total pages
    });    
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch types' },
      { status: 500 }
    );
  }
};
