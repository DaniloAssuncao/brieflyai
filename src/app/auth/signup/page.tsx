'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const [signupError, setSignupError] = useState<string | null>(null);

  // Handle signup logic (replace with your API call)
  const handleSignup = async (name: string, email: string, password: string) => {
    setSignupError(null);
    try {
      // Example: Replace with your actual API call
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create account');
      }
      // On success, redirect to login
      router.push('/auth');
    } catch (err: any) {
      setSignupError(err.message || 'Failed to create account');
    }
  };

  // Navigate to login page
  const handleSwitchToLogin = () => {
    router.push('/auth');
  };

  return (
    <SignupForm
      onSignup={handleSignup}
      onSwitchToLogin={handleSwitchToLogin}
      signupError={signupError}
    />
  );
} 