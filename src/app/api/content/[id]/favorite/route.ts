import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';
import { ApiResponse, IPublicContent } from '@/types';
import { log } from '@/lib/logger';

// Import authOptions from the NextAuth route
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-temporary-secret-key',
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    log.info(`Toggle favorite request for content ID: ${id}`, 'ContentFavoriteAPI');

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      log.warn('Unauthorized favorite toggle request', 'ContentFavoriteAPI', { contentId: id });
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find the content item
    const content = await Content.findById(id);
    if (!content) {
      log.warn(`Content not found for ID: ${id}`, 'ContentFavoriteAPI');
      return NextResponse.json(
        { success: false, error: 'Content not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Toggle the favorite status
    const newFavoriteStatus = !content.favorite;
    content.favorite = newFavoriteStatus;
    await content.save();

    // Transform to public format
    const publicContent: IPublicContent = {
      id: content._id.toString(),
      title: content.title,
      summary: content.summary,
      tags: content.tags,
      source: content.source,
      date: content.date.toISOString(),
      readTime: content.readTime,
      favorite: content.favorite,
      originalUrl: content.originalUrl,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    };

    log.info(
      `Content favorite status toggled successfully`, 
      'ContentFavoriteAPI', 
      { 
        contentId: id, 
        newStatus: newFavoriteStatus,
        userId: session.user.email 
      }
    );

    return NextResponse.json({
      success: true,
      data: publicContent,
      message: `Content ${newFavoriteStatus ? 'added to' : 'removed from'} favorites`,
    } as ApiResponse<IPublicContent>);

  } catch (error) {
    log.error('Failed to toggle favorite status', 'ContentFavoriteAPI', { contentId: params.id }, error as Error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to toggle favorite status',
        message: 'An error occurred while updating favorite status'
      } as ApiResponse,
      { status: 500 }
    );
  }
} 