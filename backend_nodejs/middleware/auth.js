// middleware/auth.js
const { verifyToken } = require('../config/jwt');
const User = require('../models/user');

async function auth(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verifyToken(token);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}

module.exports = auth;
