import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';
import { IPublicContent, HttpStatusCode } from '@/types';

export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    const content = await Content.find({}).sort({ date: -1 });
    
    // Transform to public content format
    const publicContent: IPublicContent[] = content.map(item => ({
      id: item._id.toString(),
      title: item.title,
      summary: item.summary,
      tags: item.tags,
      source: item.source,
      date: item.date.toISOString(),
      readTime: item.readTime,
      favorite: item.favorite,
      originalUrl: item.originalUrl,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }));

    return NextResponse.json(
      {
        success: true,
        data: publicContent,
        message: 'Content retrieved successfully'
      },
      { status: HttpStatusCode.OK }
    );
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve content'
      },
      { status: HttpStatusCode.INTERNAL_SERVER_ERROR }
    );
  }
} 