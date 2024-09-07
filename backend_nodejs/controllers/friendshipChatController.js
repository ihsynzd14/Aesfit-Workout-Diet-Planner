// controllers/friendshipChatController.js
const Friendship = require('../models/friendship');
const Chat = require('../models/chat');
const User = require('../models/user');

exports.sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user._id;

    // Check if a friendship already exists or is pending
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'pending') {
        return res.status(400).json({ error: 'Friend request already pending' });
      } else if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ error: 'Friendship already exists' });
      } else {
        // If it's in any other state (e.g., 'rejected'), we'll delete it and create a new request
        await Friendship.findByIdAndDelete(existingFriendship._id);
      }
    }

    const friendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });
    await friendship.save();
    res.status(201).json({ message: 'Friend request sent', friendshipId: friendship._id });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    friendship.status = 'accepted';
    await friendship.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    console.log(`Attempting to reject friend request ${requestId} for user ${userId}`);

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      console.log(`Friend request ${requestId} not found for user ${userId}`);
      return res.status(404).json({ error: 'Friend request not found' });
    }

    friendship.status = 'rejected';
    await friendship.save();

    console.log(`Friend request ${requestId} successfully rejected`);
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log(`Fetching friend requests for user ${userId}`);

    const sentRequests = await Friendship.find({
      requester: userId,
      status: 'pending'
    }).populate('recipient', 'firstName lastName email');

    const receivedRequests = await Friendship.find({
      recipient: userId,
      status: 'pending'
    }).populate('requester', 'firstName lastName email');

    console.log(`Found ${sentRequests.length} sent requests and ${receivedRequests.length} received requests`);

    res.json({
      sent: sentRequests.map(req => ({
        _id: req._id,
        recipient: req.recipient,
        status: req.status,
        createdAt: req.createdAt
      })),
      received: receivedRequests.map(req => ({
        _id: req._id,
        requester: req.requester,
        status: req.status,
        createdAt: req.createdAt
      }))
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted'
    }).populate('requester recipient', 'firstName lastName email');

    const friends = friendships.map(f => 
      f.requester._id.toString() === userId.toString() ? f.recipient : f.requester
    );

    res.json(friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const result = await Friendship.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId }
      ]
    });

    if (!result) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    // Optionally, you might want to remove or archive any associated chat
    // await Chat.findOneAndDelete({ participants: { $all: [userId, friendId] } });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.cancelFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const requesterId = req.user._id;

    console.log(`Attempting to cancel friend request from ${requesterId} to ${recipientId}`);

    const friendRequest = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    if (!friendRequest) {
      console.log(`No pending friend request found from ${requesterId} to ${recipientId}`);
      return res.status(404).json({ error: 'Friend request not found' });
    }

    await Friendship.findByIdAndDelete(friendRequest._id);

    console.log(`Successfully cancelled friend request from ${requesterId} to ${recipientId}`);
    res.json({ message: 'Friend request cancelled successfully' });
  } catch (error) {
    console.error('Cancel friend request error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user._id;

    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: participantId },
        { requester: participantId, recipient: userId }
      ],
      status: 'accepted'
    });

    if (!friendship) {
      return res.status(403).json({ error: 'You must be friends to start a chat' });
    }

    const chat = new Chat({
      participants: [userId, participantId]
    });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'firstName lastName email')
      .populate('messages.sender', 'firstName lastName email');

    if (!chat || !chat.participants.some(p => p._id.toString() === userId.toString())) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.id;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.some(p => p.toString() === userId.toString())) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const newMessage = {
      sender: userId,
      content: content
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
};