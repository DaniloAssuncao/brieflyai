'use client'

import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import MobileNav from '../MobileNav'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
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