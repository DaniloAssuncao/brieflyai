import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import { IUserRegistrationData, IPublicUser, HttpStatusCode } from '@/types'
import { validateUserRegistration } from '@/lib/validation'
import { ConflictError, ValidationAppError, createApiError, logError } from '@/lib/errors'

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, password }: IUserRegistrationData = await req.json()

    // Validate input data
    const validation = validateUserRegistration({ name, email, password });
    if (!validation.isValid) {
      throw new ValidationAppError(
        'Validation failed',
        validation.errors
      );
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Create public user response (without password)
    const publicUser: IPublicUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return NextResponse.json(
      {
        success: true,
        data: publicUser,
        message: 'User created successfully'
      },
      { status: HttpStatusCode.CREATED }
    )
  } catch (error) {
    logError(error, 'POST /api/auth/register');
    const apiError = createApiError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: apiError.error,
        message: apiError.message,
      },
      { status: apiError.statusCode }
    );
  }
} 