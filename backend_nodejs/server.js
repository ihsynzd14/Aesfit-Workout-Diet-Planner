// Project structure
// struttura di sep/
// ├── config/
// │   ├── database.js
// │   └── passport.js
// │   └── jwt.js
// ├── controllers/
// │   └── searchController.js
// ├── middleware/
// │   └── auth.js
// ├── models/
// │   └── user.js
// ├── routes/
// │   ├── auth.js
// │   └── user.js
// │   └── search.js
// ├── views/
// │   ├── login.ejs
// │   ├── register.ejs
// │   └── profile.ejs
// ├── .env
// ├── package.json
// └── server.js

// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const healthRoutes = require('./routes/health');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Assuming your frontend runs on port 3000
  optionsSuccessStatus: 200
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/search', require('./routes/search'));
app.use('/api', require('./routes/friendshipChat'));
app.use('/api/health', healthRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));