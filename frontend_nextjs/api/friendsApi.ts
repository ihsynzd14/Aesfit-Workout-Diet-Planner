// api/friendsApi.ts

import { getUserData } from '@/lib/userUtils';

export interface Friend {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface UserDetails {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function searchFriends(query: string): Promise<Friend[]> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`http://localhost:3001/search/users?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('API did not return an array:', data);
      return [];
    }
    return data;
  } catch (error) {
    console.error('Error searching friends:', error);
    throw error;
  }
}

export async function sendFriendRequest(recipientId: string): Promise<void> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch('http://localhost:3001/api/friend-request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipientId }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to send friend request');
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}


export interface FriendRequest {
  _id: string;
  requester: string;
  recipient: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface FriendRequests {
  sent: FriendRequest[];
  received: FriendRequest[];
}

export async function getFriendRequests(): Promise<FriendRequests> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch('http://localhost:3001/api/friend-requests', {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch friend requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
}

export async function respondToFriendRequest(requestId: string, action: 'accept' | 'reject'): Promise<void> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`http://localhost:3001/api/friend-request/${requestId}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error(`Failed to ${action} friend request`);
    }
  } catch (error) {
    console.error(`Error ${action}ing friend request:`, error);
    throw error;
  }
}

export async function cancelFriendRequest(requestId: string): Promise<void> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`http://localhost:3001/api/friend-request/${requestId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to cancel friend request');
    }
  } catch (error) {
    console.error('Error canceling friend request:', error);
    throw error;
  }
}