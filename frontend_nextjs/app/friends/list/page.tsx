// app/friend-requests/page.tsx
"use client"
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import { useFriendRequests } from '@/hooks/useFriendRequests'
import { useFriendCancel } from '@/hooks/useFriendCancel'
import { RequestCard } from '@/components/RequestCard'

export default function FriendRequestsPage() {
  const {
    friendRequests,
    isLoading,
    actionInProgress,
    fetchFriendRequests,
    handleRespondToRequest,
  } = useFriendRequests()

  const { cancelFriendRequest, isLoading: isCancelling } = useFriendCancel()

  useEffect(() => {
    fetchFriendRequests()
  }, [fetchFriendRequests])

  const handleCancelRequest = async (recipientId: string) => {
    const success = await cancelFriendRequest(recipientId)
    if (success) {
      fetchFriendRequests()
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-white"
      >
        Friend Requests
      </motion.h1>
      
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="received" className="text-lg">
            Received
            {friendRequests.received.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                {friendRequests.received.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="text-lg">
            Sent
            {friendRequests.sent.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                {friendRequests.sent.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
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
          ) : (
            <>
              <TabsContent value="received">
                {friendRequests.received.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {friendRequests.received.map((request) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RequestCard
                          request={request}
                          type="received"
                          onRespond={handleRespondToRequest}
                          actionInProgress={actionInProgress}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500 dark:text-gray-400 mt-8"
                  >
                    No received friend requests.
                  </motion.p>
                )}
              </TabsContent>
              <TabsContent value="sent">
                {friendRequests.sent.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {friendRequests.sent.map((request) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RequestCard
                          request={request}
                          type="sent"
                          onCancel={() => handleCancelRequest(request.recipient._id)}
                          actionInProgress={isCancelling ? request.recipient._id : null}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500 dark:text-gray-400 mt-8"
                  >
                    No sent friend requests.
                  </motion.p>
                )}
              </TabsContent>
            </>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}