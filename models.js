"use strict";
var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  isAdmin: Boolean,
  phoneNumber: String,
  pledgeClass: String,
  greekCode: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Chapter'
  },
  streetName: String,
  city: String,
  state: String,
  zipCode: String,
  email: String,
  password: String
});

userSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema)
};
