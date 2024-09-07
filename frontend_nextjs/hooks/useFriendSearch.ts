// hooks/useFriendSearch.ts

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/lib/AuthContext'
import { searchFriends, Friend } from '@/api/friendsApi'

export function useFriendSearch(debouncedSearchQuery: string) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { setAuthStatus } = useAuth()

  useEffect(() => {
    const fetchFriends = async () => {
      if (debouncedSearchQuery) {
        setIsLoading(true)
        try {
          const data = await searchFriends(debouncedSearchQuery)
          setFriends(data)
        } catch (error) {
          console.error('Error searching friends:', error)
          if (error instanceof Error && error.message === 'User is not authenticated') {
            toast({
              title: "Authentication Error",
              description: "Please log in to search friends.",
              variant: "destructive",
            })
            setAuthStatus(false, null)
            router.push('/login')
          } else if (error instanceof Error && error.message === 'Authentication failed. Please log in again.') {
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            })
            setAuthStatus(false, null)
            router.push('/login')
          } else {
            toast({
              title: "Error",
              description: "Failed to search friends. Please try again.",
              variant: "destructive",
            })
          }
          setFriends([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setFriends([])
      }
    }

    fetchFriends()
  }, [debouncedSearchQuery, toast, router, setAuthStatus])

  return { friends, isLoading }
}