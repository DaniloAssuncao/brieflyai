'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //const [isLogin, setIsLogin] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Handle login with NextAuth
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    console.log('AuthPage handleLogin called', { email, password, rememberMe });
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      console.log('AuthPage handleLogin error', result.error);
      // Handle different error cases
      switch (result.error) {
        case 'CredentialsSignin':
          setLoginError('Invalid email or password')
          break
        default:
          setLoginError('An error occurred during login')
      }
      return
    }

    if (!result?.error) {
      setLoginError(null)
      const from = searchParams.get('from') || '/dashboard'
      router.push(from)
    }
  }

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  // Navigate to signup page
  const handleSwitchToSignup = () => {
    router.push('/auth/signup')
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onSwitchToSignup={handleSwitchToSignup}
      onGoogleLogin={handleGoogleLogin}
      loginError={loginError}
      setLoginError={setLoginError}
    />
  )
} 