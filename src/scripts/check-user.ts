import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function checkUser() {
  try {
    console.log('🔍 Checking user in database...');
    
    // Connect to database
    await connectToDatabase();
    console.log('✅ Connected to database');
    
    // Find the user
    const user = await User.findOne({ email: 'danilovictor00@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('✅ User found:');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Password hash:', user.password);
    console.log('📅 Created:', user.createdAt);
    
    // Test password verification
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🧪 Password test with "password123":', isValid ? '✅ VALID' : '❌ INVALID');
    
    // Test with wrong password
    const isInvalid = await bcrypt.compare('wrongpassword', user.password);
    console.log('🧪 Password test with "wrongpassword":', isInvalid ? '❌ SHOULD BE INVALID' : '✅ CORRECTLY INVALID');
    
  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    process.exit();
  }
}

// Run the check function
checkUser(); 