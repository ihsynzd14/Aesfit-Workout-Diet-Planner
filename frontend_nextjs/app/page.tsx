'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-white via-white to-white-100 dark:from-[#111827] dark:via-[#1A243B] dark:to-[#111827]">
      <Card className="w-[350px] backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
                Welcome to <span className="text-blue-600 dark:text-blue-400">MyApp</span>
              </h1>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center space-x-2 mb-6 text-gray-600 dark:text-gray-300"
          >
            <Sparkles className="w-5 h-5" />
            <p className="text-sm">Your gateway to seamless experiences</p>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/login" className="w-full">
            <Button variant="default" size="lg" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}