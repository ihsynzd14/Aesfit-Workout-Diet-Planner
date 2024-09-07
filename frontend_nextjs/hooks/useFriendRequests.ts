// hooks/useFriendRequests.ts
import { useState, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"
import { FriendRequest, getFriendRequests, cancelFriendRequest } from '@/api/friendsApi'
import { getUserData } from '@/lib/userUtils'

export function useFriendRequests() {
  const [friendRequests, setFriendRequests] = useState<{ sent: FriendRequest[], received: FriendRequest[] }>({ sent: [], received: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFriendRequests = useCallback(async () => {
    setIsLoading(true)
    try {
      const requests = await getFriendRequests()
      setFriendRequests(requests)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch friend requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const handleRespondToRequest = useCallback(async (requestId: string, action: 'accept' | 'reject') => {
    setActionInProgress(requestId)
    const userData = getUserData()
    if (!userData || !userData.token) {
      toast({
        title: "Error",
        description: "You are not authenticated. Please log in and try again.",
        variant: "destructive",
      })
      setActionInProgress(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/friend-request/${requestId}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} friend request`);
      }

      toast({
        title: "Success",
        description: `Friend request ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`,
      })
      await fetchFriendRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} friend request. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setActionInProgress(null)
    }
  }, [fetchFriendRequests, toast])

  const handleCancelRequest = useCallback(async (requestId: string) => {
    setActionInProgress(requestId)
    try {
      await cancelFriendRequest(requestId)
      toast({
        title: "Success",
        description: "Friend request cancelled successfully.",
      })
      await fetchFriendRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel friend request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionInProgress(null)
    }
  }, [fetchFriendRequests, toast])

  return {
    friendRequests,
    isLoading,
    actionInProgress,
    fetchFriendRequests,
    handleRespondToRequest,
    handleCancelRequest
  }
}