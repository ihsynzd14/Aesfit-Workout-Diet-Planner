// hooks/useFriends.ts
import { useState, useEffect, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"
import { getUserData } from '@/lib/userUtils'

export interface Friend {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingFriend, setRemovingFriend] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchFriends = useCallback(async () => {
    setIsLoading(true)
    const userData = getUserData()
    if (!userData || !userData.token) {
      toast({
        title: "Error",
        description: "You are not authenticated. Please log in and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/friends/', {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch friends')
      }

      const data = await response.json()
      setFriends(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch friends. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const removeFriend = useCallback(async (friendId: string) => {
    setRemovingFriend(friendId)
    const userData = getUserData()
    if (!userData || !userData.token) {
      toast({
        title: "Error",
        description: "You are not authenticated. Please log in and try again.",
        variant: "destructive",
      })
      setRemovingFriend(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/friend/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to remove friend')
      }

      toast({
        title: "Success",
        description: "Friend removed successfully.",
      })
      await fetchFriends() // Refresh the friends list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove friend. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRemovingFriend(null)
    }
  }, [fetchFriends, toast])

  useEffect(() => {
    fetchFriends()
  }, [fetchFriends])

  return { friends, isLoading, removingFriend, fetchFriends, removeFriend }
}