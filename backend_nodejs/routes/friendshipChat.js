// routes/friendshipChat.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const friendshipChatController = require('../controllers/friendshipChatController');

// Friendship routes
router.post('/friend-request', auth, friendshipChatController.sendFriendRequest);
router.get('/friend-requests', auth, friendshipChatController.getFriendRequests);
router.put('/friend-request/:id/accept', auth, friendshipChatController.acceptFriendRequest);
router.put('/friend-request/:id/reject', auth, friendshipChatController.rejectFriendRequest);
router.get('/friends', auth, friendshipChatController.getFriends);
router.delete('/friend/:friendId', auth, friendshipChatController.removeFriend);
router.delete('/friend-request/:recipientId', auth, friendshipChatController.cancelFriendRequest);

// Chat routes
router.post('/chat', auth, friendshipChatController.createChat);
router.get('/chat/:id', auth, friendshipChatController.getChat);
router.post('/chat/:id/message', auth, friendshipChatController.sendMessage);

module.exports = router;