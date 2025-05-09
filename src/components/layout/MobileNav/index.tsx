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

interface MobileNavProps {
  sidebarOpen: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'YouTube', href: '/youtube', icon: Youtube },
  { label: 'Favorites', href: '/favorites', icon: Star },
  { label: 'Settings', href: '/settings', icon: Settings }
]

export default function MobileNav({ sidebarOpen }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white transition-transform duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:hidden ${
      sidebarOpen ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="container mx-auto flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-600'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 