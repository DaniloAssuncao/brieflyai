import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { ApiResponse } from '@/types';
import { log } from '@/lib/logger';

// Import authOptions from the NextAuth route
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-temporary-secret-key',
};

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    digest: boolean;
  };
  preferences: {
    defaultView: 'all' | 'favorites' | 'youtube';
    itemsPerPage: number;
    autoRefresh: boolean;
  };
}

export async function GET() {
  try {
    log.info('User settings request received', 'SettingsAPI');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      log.warn('Unauthorized settings request', 'SettingsAPI');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Default settings if none exist
    const defaultSettings: UserSettings = {
      theme: 'system',
      notifications: {
        email: true,
        push: false,
        digest: true,
      },
      preferences: {
        defaultView: 'all',
        itemsPerPage: 20,
        autoRefresh: true,
      },
    };

    const userWithSettings = user as { settings?: UserSettings };
    const settings = userWithSettings.settings || defaultSettings;

    log.info('User settings retrieved successfully', 'SettingsAPI');

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings retrieved successfully',
    } as ApiResponse<UserSettings>);

  } catch (error) {
    log.error('Failed to fetch user settings', 'SettingsAPI', {}, error as Error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings',
        message: 'An error occurred while retrieving settings'
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    log.info('User settings update request received', 'SettingsAPI');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      log.warn('Unauthorized settings update request', 'SettingsAPI');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { settings: body } },
      { new: true, upsert: false }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' } as ApiResponse,
        { status: 404 }
      );
    }

    log.info('User settings updated successfully', 'SettingsAPI');

    const updatedUserWithSettings = updatedUser as { settings?: UserSettings };
    
    return NextResponse.json({
      success: true,
      data: updatedUserWithSettings.settings,
      message: 'Settings updated successfully',
    } as ApiResponse<UserSettings>);

  } catch (error) {
    log.error('Failed to update user settings', 'SettingsAPI', {}, error as Error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings',
        message: 'An error occurred while updating settings'
      } as ApiResponse,
      { status: 500 }
    );
  }
} 