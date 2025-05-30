import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function recreateUser() {
  try {
    console.log('🔄 Recreating user...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to database');
    
    // Delete existing user
    await User.deleteOne({ email: 'danilovictor00@gmail.com' });
    console.log('🗑️ Deleted existing user');
    
    // Hash password with explicit salt rounds
    const password = 'password123';
    console.log('🔐 Hashing password:', password);
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔑 Generated hash:', hashedPassword);
    
    // Test the hash immediately
    const testResult = await bcrypt.compare(password, hashedPassword);
    console.log('🧪 Immediate hash test:', testResult ? '✅ VALID' : '❌ INVALID');
    
    if (!testResult) {
      console.log('❌ Hash generation failed! Aborting...');
      return;
    }
    
    // Create new user
    const newUser = new User({
      name: 'Danilo Victor',
      email: 'danilovictor00@gmail.com',
      password: hashedPassword,
    });
    
    await newUser.save();
    console.log('✅ User recreated successfully!');
    
    // Verify the saved user
    const savedUser = await User.findOne({ email: 'danilovictor00@gmail.com' });
    if (savedUser) {
      console.log('📧 Saved Email:', savedUser.email);
      console.log('👤 Saved Name:', savedUser.name);
      console.log('🔑 Saved Hash:', savedUser.password);
      
      // Test password again
      const finalTest = await bcrypt.compare(password, savedUser.password);
      console.log('🧪 Final password test:', finalTest ? '✅ VALID' : '❌ INVALID');
    }
    
  } catch (error) {
    console.error('❌ Error recreating user:', error);
  } finally {
    process.exit();
  }
}

// Run the function
recreateUser(); 