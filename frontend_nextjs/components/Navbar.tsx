"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { clearUserData, isAuthenticated } from '@/lib/userUtils'
import { useAuth } from '@/lib/AuthContext'
import { UserPlus, Home, Users, List, LogOut, ChevronDown, LucideIcon, Dumbbell, Search } from 'lucide-react'

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, children }) => (
  <Link href={href}>
    <Button variant="ghost" size="sm" className="flex items-center">
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  </Link>
)

interface DropdownProps {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { isLoggedIn, user, setAuthStatus } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        handleLogout()
      }
    }

    // Check authentication status every minute
    const interval = setInterval(checkAuth, 60000)

    // Check authentication on focus
    window.addEventListener('focus', checkAuth)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    clearUserData()
    setAuthStatus(false, null)
    router.push('/login')
  }


  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed w-full z-10 shadow-sm"
    >
      <div className="container mx-auto flex flex-wrap justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          AesFit
        </Link>
        <div className="flex items-center space-x-4">
          {isLoggedIn && user ? (
            <>
              <span className="text-gray-800 dark:text-white hidden md:inline">Welcome, {user.firstName}</span>
              <div className="flex items-center space-x-2">
                <Dropdown label="Exercises" icon={Dumbbell}>
                  <Link href="/exercises/body-search" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Search className="inline-block mr-2 h-4 w-4" />
                    Body Search
                  </Link>
                  <Link href="/exercises/manual-search" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Search className="inline-block mr-2 h-4 w-4" />
                    Manual Search
                  </Link>
                </Dropdown>
                <Dropdown label="Friends" icon={Users}>
                  <Link href="/friends" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UserPlus className="inline-block mr-2 h-4 w-4" />
                    Add Friends
                  </Link>
                  <Link href="/friends/list" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <List className="inline-block mr-2 h-4 w-4" />
                    Friend Requests
                  </Link>
                  <Link href="/friends/myfriends" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Users className="inline-block mr-2 h-4 w-4" />
                    My Friends
                  </Link>
                </Dropdown>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink href="/login" icon={LogOut}>Login</NavLink>
              <NavLink href="/register" icon={List}>Register</NavLink>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}