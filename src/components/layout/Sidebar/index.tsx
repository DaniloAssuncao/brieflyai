'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Youtube, Star, Settings, ChevronLeft, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'YouTube', href: '/youtube', icon: Youtube },
  { label: 'Favorites', href: '/favorites', icon: Star },
  { label: 'Settings', href: '/settings', icon: Settings }
]

export default function Sidebar({ isOpen, toggleSidebar, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const handleCollapseClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Collapse button clicked, current state:', collapsed)
    onToggleCollapse()
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 transform border-r border-gray-200 bg-white transition-all duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:relative lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}>
      <div className="h-full flex flex-col py-6">
        {/* Collapse/Expand button for desktop */}
        <button 
          type="button"
          className="mb-4 ml-auto mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 hidden lg:block" 
          onClick={handleCollapseClick}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <nav className={`flex flex-col gap-1 px-2 ${collapsed ? 'items-center' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === item.href
                    ? 'bg-gray-100 text-blue-600 dark:bg-gray-800'
                    : 'text-gray-600 dark:text-gray-300'
                } ${collapsed ? 'justify-center' : ''}`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
              >
                <Icon size={20} />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
} 