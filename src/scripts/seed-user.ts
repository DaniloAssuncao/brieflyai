import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function seedUser() {
  try {
    console.log('🌱 Starting user seeding...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to database');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'danilovictor00@gmail.com' });
    
    if (existingUser) {
      console.log('👤 User already exists');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create test user
    const testUser = new User({
      name: 'Danilo Victor',
      email: 'danilovictor00@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('📧 Email: danilovictor00@gmail.com');
    console.log('🔑 Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding user:', error);
  } finally {
    process.exit();
  }
}

// Run the seeding function
seedUser(); 