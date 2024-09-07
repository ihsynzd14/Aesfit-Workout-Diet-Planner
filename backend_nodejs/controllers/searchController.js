// controllers/searchController.js
const User = require('../models/user');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id; // Assuming the authenticated user's ID is available in req.user._id

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // First, try the text search
    let users = await User.find(
      {
        $text: { $search: query },
        _id: { $ne: currentUserId } // Exclude the current user
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .select('_id email firstName lastName fullName')
    .limit(10);

    // If no results, try regex search on fullName
    if (users.length === 0) {
      users = await User.find(
        {
          fullName: new RegExp(query, 'i'),
          _id: { $ne: currentUserId } // Exclude the current user
        }
      )
      .select('_id email firstName lastName fullName')
      .limit(10);
    }

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: "An error occurred while searching" });
  }
};