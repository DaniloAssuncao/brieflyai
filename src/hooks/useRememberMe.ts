import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useRememberMe = () => {
  const { data: session, status } = useSession()
  const [isRemembered, setIsRemembered] = useState(false)

  useEffect(() => {
    // Check if user was remembered from localStorage
    const wasRemembered = localStorage.getItem('rememberMe') === 'true'
    setIsRemembered(wasRemembered)
  }, [])

  // Check if session is from remember me
  const sessionRememberMe = session?.rememberMe || false

  // Get time until session expires
  const getTimeUntilExpiry = () => {
    if (!session?.expires) return null
    
    const expiryDate = new Date(session.expires)
    const now = new Date()
    const timeLeft = expiryDate.getTime() - now.getTime()
    
    if (timeLeft <= 0) return null
    
    return {
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    }
  }

  // Clear remember me data
  const clearRememberMe = () => {
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('rememberedEmail')
    setIsRemembered(false)
  }

  return {
    isRemembered,
    sessionRememberMe,
    getTimeUntilExpiry,
    clearRememberMe,
    session,
    status
  }
} 