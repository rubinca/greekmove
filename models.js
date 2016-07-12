"use strict";

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Not used yet below this line
  email: String,
  facebookId: String,
  registrationCode: String,
  sessionId: String
});

var messageSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  body: {
    type: String,
    default: 'Yo',
    required: true
  }
});

userSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema),
  Message: mongoose.model('Message', messageSchema)
};
