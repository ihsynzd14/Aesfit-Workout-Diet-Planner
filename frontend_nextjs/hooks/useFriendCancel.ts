// hooks/useFriendCancel.ts
import { useState, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"
import { getUserData } from '@/lib/userUtils'

export function useFriendCancel() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const cancelFriendRequest = useCallback(async (recipientId: string) => {
    setIsLoading(true)
    const userData = getUserData()
    if (!userData || !userData.token) {
      toast({
        title: "Error",
        description: "You are not authenticated. Please log in and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return false
    }

    try {
      const response = await fetch(`http://localhost:3001/api/friend-request/${recipientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientId }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel friend request')
      }

      toast({
        title: "Success",
        description: "Friend request cancelled successfully.",
      })
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return { cancelFriendRequest, isLoading }
}