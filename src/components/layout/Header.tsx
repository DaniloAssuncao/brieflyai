'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, Menu } from 'lucide-react'

interface HeaderProps {

  toggleSidebar: () => void
}

const AVATAR_URL = 'https://randomuser.me/api/portraits/men/32.jpg' // Placeholder avatar

export default function Header({
  toggleSidebar,
}: HeaderProps) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleSignOut = async () => {
    setMenuOpen(false)
    await signOut({ callbackUrl: '/auth' })
  }

  const handleSettingsClick = () => {
    setMenuOpen(false)
    router.push('/settings')
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full sticky top-0 z-50">
      <div className="w-full px-4 h-16 flex items-center justify-between">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <span className="text-gray-700 dark:text-gray-200 text-xl font-semibold tracking-wide select-none mb-0">
            Briefly<span className="text-teal-500 dark:text-teal-400">AI</span>
          </span>
        </div>
        
        {/* Auth/Profile */}
        <nav className="flex items-center space-x-2">
          <div className="relative" ref={menuRef}>
            <button
              className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open profile menu"
            >
              <img
                src={AVATAR_URL}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
                  onClick={handleSettingsClick}
                >
                  <Settings className="mr-3" size={20} />
                  Settings
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-3" size={20} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
} 