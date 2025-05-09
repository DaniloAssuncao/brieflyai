'use client'

import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import MobileNav from '../MobileNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    html.classList.remove(currentTheme)
    html.classList.add(newTheme)
    setIsDarkMode(newTheme === 'dark')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        darkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-50 p-4 dark:bg-gray-950 lg:p-8">
          {children}
        </main>
      </div>
      <MobileNav sidebarOpen={isSidebarOpen} />
    </div>
  )
} 