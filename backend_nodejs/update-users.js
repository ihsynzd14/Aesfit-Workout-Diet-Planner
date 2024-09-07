// update-users.js
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb+srv://admin:teseo123@teseo.sf96u.mongodb.net/?retryWrites=true&w=majority&appName=Teseo', { useNewUrlParser: true, useUnifiedTopology: true });

async function updateUsers() {
  const users = await User.find({});
  for (let user of users) {
    user.fullName = `${user.firstName} ${user.lastName}`;
    user.searchField = `${user.email} ${user.fullName}`.toLowerCase();
    await user.save();
  }
  console.log('All users updated');
  mongoose.connection.close();
}

updateUsers();