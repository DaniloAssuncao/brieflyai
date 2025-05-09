'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Youtube, Star, Settings } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'YouTube', href: '/youtube', icon: Youtube },
  { label: 'Favorites', href: '/favorites', icon: Star },
  { label: 'Settings', href: '/settings', icon: Settings }
]

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:relative lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <nav className="flex h-full flex-col gap-2 p-4">
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
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar()
                }
              }}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 