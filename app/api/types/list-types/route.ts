import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('search') || '';

  try {
    // Fetch types along with their category counts
    const types = await db.type.findMany({
      where: {
        title: {
          contains: searchQuery,
        },
      },
      select: {
        id: true,
        title: true,
        image: true,
        // Assuming there is a relation to categories, include a count of related categories
        _count: {
          select: {
            categories: true, // Change 'categories' to the actual name of the relation
          },
        },
      },
    });

    // Map the types to include categoryCount
    const typesWithCategoryCount = types.map(type => ({
      id: type.id,
      title: type.title,
      image: type.image,
      categoryCount: type._count.categories, // Access the count from the fetched data
    }));

    return NextResponse.json({ success: true, types: typesWithCategoryCount });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch types' },
      { status: 500 }
    );
  }
};
