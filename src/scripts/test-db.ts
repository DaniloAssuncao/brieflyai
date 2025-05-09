import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testDatabase() {
  try {
    // Debug environment variables
    console.log('Environment variables:')
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set')

    // Connect to database
    console.log('\nConnecting to MongoDB...')
    await connectToDatabase()
    console.log('Successfully connected to MongoDB!')

    // Test User model
    console.log('\nTesting User model...')
    
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10)
    }

    // Try to create the user
    const user = await User.create(testUser)
    console.log('Successfully created test user:', user.email)

    // Try to find the user
    const foundUser = await User.findOne({ email: testUser.email })
    console.log('Successfully found test user:', foundUser?.email)

    // Clean up - delete the test user
    await User.deleteOne({ email: testUser.email })
    console.log('Successfully cleaned up test user')

    console.log('\nAll database tests passed!')
  } catch (error) {
    console.error('Database test failed:', error)
  } finally {
    process.exit()
  }
}

testDatabase() 