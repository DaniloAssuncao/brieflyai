import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    try {
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('MongoDB connection URL:', MONGODB_URI)
        return mongoose
      })
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Error in cached connection:', e)
    throw e
  }

  return cached.conn
}

export default connectToDatabase 