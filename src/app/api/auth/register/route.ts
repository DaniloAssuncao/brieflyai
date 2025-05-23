import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Remove password from response
    //const { password: _password, ...userWithoutPassword } = user.toObject()
    const {  ...userWithoutPassword } = user.toObject()

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error in register:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 