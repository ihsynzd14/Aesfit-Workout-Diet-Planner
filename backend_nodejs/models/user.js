// models/user.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String },
  searchField: { type: String },
  // Health-related attributes
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'heavy', 'athlete']
  },
  idealWeight: { type: Number }, // in kg
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  age: { type: Number },
  bmi: { type: Number },
  metabolicRate: { type: Number },
  tdee: { type: Number }
});

UserSchema.virtual('friends', {
  ref: 'Friendship',
  localField: '_id',
  foreignField: 'requester',
  match: { status: 'accepted' }
});

// Create a text index on the searchField
UserSchema.index({ searchField: 'text' });

// Create a separate index on fullName for regex searches
UserSchema.index({ fullName: 1 });

// Pre-save hook to update the searchField and fullName
UserSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.searchField = `${this.email} ${this.fullName}`.toLowerCase();
  next();
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);