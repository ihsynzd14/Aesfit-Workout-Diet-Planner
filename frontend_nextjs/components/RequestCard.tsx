// components/RequestCard.tsx

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FriendRequest, UserDetails } from '@/api/friendsApi'
import { format } from 'date-fns'
import { UserMinus, Check, X, Loader2, User } from 'lucide-react'

interface RequestCardProps {
  request: FriendRequest
  type: 'sent' | 'received'
  onRespond?: (requestId: string, action: 'accept' | 'reject') => Promise<void>
  onCancel?: (requestId: string) => Promise<void>
  actionInProgress: string | null
}

const getUserDetails = (user: string | UserDetails): UserDetails => {
  if (typeof user === 'string') {
    return {
      _id: user,
      email: 'Unknown',
      firstName: 'Unknown',
      lastName: 'User'
    }
  }
  return user
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, type, onRespond, onCancel, actionInProgress }) => {
  const userDetails = getUserDetails(type === 'sent' ? request.recipient : request.requester)
  
  return (
    <Card className="mb-4 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              {userDetails.firstName !== 'Unknown' ? (
                <AvatarImage src={`https://api.dicebear.com/6.x/micah/svg?seed=${userDetails.firstName}${userDetails.lastName}`} />
              ) : (
                <User className="h-6 w-6" />
              )}
              <AvatarFallback>{userDetails.firstName[0]}{userDetails.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{userDetails.firstName} {userDetails.lastName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userDetails.email}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {type === 'sent' ? 'Sent to' : 'Received from'} {format(new Date(request.createdAt), 'PPp')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {type === 'received' && onRespond ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onRespond(request._id, 'accept')}
                  disabled={actionInProgress === request._id}
                >
                  {actionInProgress === request._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRespond(request._id, 'reject')}
                  disabled={actionInProgress === request._id}
                >
                  {actionInProgress === request._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                  Reject
                </Button>
              </>
            ) : type === 'sent' && onCancel ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(request._id)}
                disabled={actionInProgress === request._id}
              >
                {actionInProgress === request._id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserMinus className="mr-2 h-4 w-4" />}
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}