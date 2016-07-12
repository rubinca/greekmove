"use strict";

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  facebookId: String,
  registrationCode: String,
  sessionId: String
});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
