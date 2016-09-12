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

var eventSchema = mongoose.Schema({
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  location: String,
  greekCode: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Chapter'
  },
  users: Array
});

eventSchema.plugin(findOrCreate);

var chapterSchema = mongoose.Schema({
  title: String,
  announcements: Array,
  president: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  expiration: Date
});

chapterSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema),
  Event: mongoose.model('Event', eventSchema),
  Chapter: mongoose.model('Chapter', chapterSchema)
};
