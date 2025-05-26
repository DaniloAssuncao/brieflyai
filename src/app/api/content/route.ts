import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    await connectToDatabase();

    const contentItems = await Content.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalItems = await Content.countDocuments({});

    return NextResponse.json({
      data: contentItems,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json(
      { message: "Failed to fetch content. Please try again later." },
      { status: 500 }
    );
  }
} 