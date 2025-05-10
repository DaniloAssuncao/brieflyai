'use client'

import React, { useEffect, useCallback } from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import MobileNav from '../MobileNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev: boolean) => !prev)
  }, [])

  const toggleSidebarCollapse = useCallback(() => {
    console.log('Layout: Toggling sidebar collapse, current state:', isSidebarCollapsed)
    setIsSidebarCollapsed((prev: boolean) => {
      const newState = !prev
      console.log('Layout: New collapsed state will be:', newState)
      return newState
    })
  }, [isSidebarCollapsed])

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
        <main className={`flex-1 bg-gray-50 p-4 dark:bg-gray-950 lg:p-8 transition-all duration-200 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          {children}
        </main>
      </div>
      <MobileNav sidebarOpen={isSidebarOpen} />
    </div>
  )
} 