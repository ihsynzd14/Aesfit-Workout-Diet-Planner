// routes/search.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middleware/auth');

// Protect the route with custom auth middleware
router.get('/users', auth, searchController.searchUsers);

module.exports = router;