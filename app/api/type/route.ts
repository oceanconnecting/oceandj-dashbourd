/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Type {
  id: number;
  title: string;
  image: string;
  _count: {
    categories: number;
  };
}

export const GET = async (req: Request): Promise<NextResponse> => {
  try {
    const types: Type[] = await db.type.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        _count: {
          select: {
            categories: true,
          },
        },
      },
    });

    const typesWithCategoryCount = types.map((type) => ({
      id: type.id,
      title: type.title,
      image: type.image,
      categoryCount: type._count.categories,
    }));

    return NextResponse.json({
      success: true,
      types: typesWithCategoryCount,
    });
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch types' },
      { status: 500 }
    );
  }
};
