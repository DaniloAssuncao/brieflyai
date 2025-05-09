'use client'

import React, { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

export default function AuthPage() {
  const router = useRouter()
  const { status } = useSession()
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Handle login with NextAuth
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setLoginError('Invalid email or password')
            break
          default:
            setLoginError('An error occurred during login')
        }
        return
      }

      if (result?.ok) {
        setLoginError(null)
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('An unexpected error occurred')
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

  // If loading, show nothing
  if (status === 'loading') {
    return null
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