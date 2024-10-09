/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('s') || '';

    if (!searchTerm) {
      return NextResponse.json({ success: false, message: 'Search term is required' }, { status: 400 });
    }

    const whereClause: any = {
      AND: [
        {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
      ],
    };

    const types = await db.type.findMany({
      where: whereClause
    });

    return NextResponse.json({ success: true, types });
  } catch (error) {
    console.error('Error searching types:', error);
    return NextResponse.json({ success: false, message: 'Failed to search types' }, { status: 500 });
  }
};
