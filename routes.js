"use strict";

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('./models');

// Auth routes
router.post('/login', passport.authenticate('local'));
router.post('/register', function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) {
      next(err);
    } else {
      res.send(user);
    }
  });
});

// Beyond this point the user must be logged in
router.use(function(req, res, next) {
  if (!req.isAuthenticated())
    res.status(401).send("not authenticated");
  next();
});

module.exports = router;
