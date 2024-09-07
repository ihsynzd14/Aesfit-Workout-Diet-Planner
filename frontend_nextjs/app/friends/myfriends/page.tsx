// app/friends/myfriends/page.tsx
"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, User, Search, MessageCircle, UserMinus } from 'lucide-react'
import { useFriends } from '@/hooks/useFriends'
import Link from 'next/link'

export default function FriendsListPage() {
  const { friends, isLoading, removingFriend, removeFriend } = useFriends()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFriends = friends.filter(friend => 
    friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white"
      >
        My Friends
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 max-w-md mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-gray-300 dark:border-gray-700 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition duration-300 bg-white dark:bg-gray-800"
          />
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </motion.div>
        ) : filteredFriends.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFriends.map((friend) => (
              <motion.div
                key={friend._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800">
                          <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${friend.firstName}${friend.lastName}`} />
                          <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{friend.firstName} {friend.lastName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/chat/${friend._id}`}>
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary-dark transition-colors">
                            <MessageCircle className="h-6 w-6" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => removeFriend(friend._id)}
                          disabled={removingFriend === friend._id}
                        >
                          {removingFriend === friend._id ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <UserMinus className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 mt-12"
          >
            <User size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-xl font-semibold">No friends found</p>
            <p className="mt-2">
              {searchTerm ? "Try adjusting your search" : "You don't have any friends yet. Start connecting with people!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}