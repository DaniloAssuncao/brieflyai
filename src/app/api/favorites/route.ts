import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';
import { ApiResponse, IPublicContent, SourceType } from '@/types';
import { log } from '@/lib/logger';

// Import authOptions from the NextAuth route
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-temporary-secret-key',
};

export async function GET() {
  try {
    log.info('Favorites content request received', 'FavoritesAPI');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      log.warn('Unauthorized favorites content request', 'FavoritesAPI');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get favorite content only
    const contents = await Content.find({ 
      favorite: true 
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Transform to public format
    const publicContents: IPublicContent[] = contents.map((content: unknown) => {
      const contentDoc = content as {
        _id: { toString(): string };
        title: string;
        summary: string;
        tags: string[];
        source: {
          name: string;
          avatarUrl: string;
          type: SourceType;
          url: string;
        };
        date?: Date;
        readTime?: string;
        originalUrl: string;
        createdAt: Date;
        updatedAt: Date;
        favorite?: boolean;
      };
      
            return {
        id: contentDoc._id.toString(),
        title: contentDoc.title,
        summary: contentDoc.summary,
        tags: contentDoc.tags,
        source: {
          name: contentDoc.source.name,
          avatarUrl: contentDoc.source.avatarUrl,
          type: contentDoc.source.type,
          url: contentDoc.source.url,
        },
        date: contentDoc.date ? contentDoc.date.toISOString() : contentDoc.createdAt.toISOString(),
        readTime: contentDoc.readTime || '5 min read',
        originalUrl: contentDoc.originalUrl,
        createdAt: contentDoc.createdAt.toISOString(),
        updatedAt: contentDoc.updatedAt.toISOString(),
        favorite: contentDoc.favorite || false,
      };
    });

    log.info(`Retrieved ${publicContents.length} favorite contents`, 'FavoritesAPI');

    return NextResponse.json({
      success: true,
      data: publicContents,
      message: 'Favorite content retrieved successfully',
    } as ApiResponse<IPublicContent[]>);

  } catch (error) {
    log.error('Failed to fetch favorite content', 'FavoritesAPI', {}, error as Error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch favorite content',
        message: 'An error occurred while retrieving favorite content'
      } as ApiResponse,
      { status: 500 }
    );
  }
} 