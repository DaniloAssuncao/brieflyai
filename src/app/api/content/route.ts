import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Content from '@/models/Content';

export async function GET() {
  await connectToDatabase();
  const content = await Content.find({}).sort({ date: -1 });
  return NextResponse.json(content);
} 