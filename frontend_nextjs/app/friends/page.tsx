"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from '@/hooks/useDebounce'
import { useFriendSearch } from '@/hooks/useFriendSearch'
import { Friend, sendFriendRequest } from '@/api/friendsApi'
import { Search, UserPlus, Mail, Star, Activity, Coffee, Check } from 'lucide-react'

const InteractionMetric = ({ value }: { value: number }) => {
  const icons = [
    { icon: Coffee, tooltip: "Occasional" },
    { icon: Activity, tooltip: "Active" },
    { icon: Star, tooltip: "Frequent" }
  ]
  const index = Math.min(Math.floor(value * icons.length), icons.length - 1)
  const Icon = icons[index].icon
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Icon size={18} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{icons[index].tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const { friends, isLoading } = useFriendSearch(debouncedSearchQuery)
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSendFriendRequest = async (friend: Friend) => {
    try {
      await sendFriendRequest(friend._id)
      setPendingRequests(prev => new Set(prev).add(friend._id))
      toast({
        title: "Friend Request Sent",
        description: `A friend request has been sent to ${friend.fullName}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white"
      >
        Connect with Friends
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
            placeholder="Discover new connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
          </motion.div>
        ) : friends.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {friends.map((friend: Friend, index) => (
              <motion.div
                key={friend._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:shadow-primary/10 hover:scale-105 dark:bg-gray-800 bg-gray-100">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800">
                        <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${friend.fullName}`} alt={friend.fullName} />
                        <AvatarFallback>{friend.firstName[0]}{friend.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{friend.fullName}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <InteractionMetric value={Math.random()} /> {/* Replace with actual interaction data */}
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition duration-300">
                                <Mail size={18} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send Message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                className={`p-2 rounded-full ${
                                  pendingRequests.has(friend._id) 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                                } transition duration-300`}
                                onClick={() => handleSendFriendRequest(friend)}
                                disabled={pendingRequests.has(friend._id)}
                              >
                                {pendingRequests.has(friend._id) ? <Check size={18} /> : <UserPlus size={18} />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{pendingRequests.has(friend._id) ? 'Friend Request Sent' : 'Add Friend'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 dark:text-gray-400 mt-12"
          >
            <Search size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-xl font-semibold">No connections found</p>
            <p className="mt-2">Try adjusting your search to find more friends</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}