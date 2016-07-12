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

module.exports = mongoose.model('User', userSchema);
