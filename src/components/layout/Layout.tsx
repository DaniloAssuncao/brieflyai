'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const [darkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
    
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev)
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        {session && (
          <Header
            toggleSidebar={toggleSidebar}
          />
        )}
        
        <div className="flex">
          {session && (
            <div className="border-r dark:border-gray-800 dark:bg-gray-900 " >
              <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar}
                collapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
              />
            </div>
          )}
          
          <main className={`flex-1 w-full max-w-full px-2 sm:px-4 py-4 md:py-6 md:pl-4 md:pr-6 md:max-w-5xl md:mx-auto ${session ? (isSidebarOpen ? 'md:ml-64' : 'md:ml-16') : ''}`}>
            {children}
          </main>
        </div>
        {session && <MobileNav sidebarOpen={isSidebarOpen} />}
      </div>
    </div>
  )
} 