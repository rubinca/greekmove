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

userSchema.plugin(findOrCreate);

var messageSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  createdAt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  message: {
    type: String,
    default: "Ho!",
    required: true
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Message: mongoose.model('Message', messageSchema)
};
