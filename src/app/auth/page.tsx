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
      // User is already authenticated, redirect to dashboard
      window.location.replace('/dashboard')
    }
  }, [status])

  // Handle login with NextAuth
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    try {
      console.log('Attempting login with:', { email, rememberMe })
      
      const result = await signIn('credentials', {
        email,
        password,
        rememberMe: rememberMe.toString(), // Convert boolean to string for NextAuth
        redirect: false
      })

      console.log('Login result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
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
        console.log('Login successful, redirecting to dashboard')
        setLoginError(null)
        
        // Store remember me preference in localStorage for future reference
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberedEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('rememberedEmail')
        }
        
        // Force redirect to dashboard
        window.location.replace('/dashboard')
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