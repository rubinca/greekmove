"use strict";

var bcrypt = require('bcrypt');
var express = require('express');
var models = require('./models');
var User = models.User;
var Message = models.Message;
var _ = require('underscore');

module.exports = function (passport) {
  var router = express.Router();

  /* Authentication routes */

  router.get('/login/failure', function(req, res) {
    res.status(401).json({
      success: false,
      error: req.flash('error')[0]
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/login/success',
    failureRedirect: '/login/failure',
    failureFlash: true
  }));

  router.post('/register', function(req, res, next) {
    var params = _.pick(req.body, ['username', 'password']);
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(params.password, salt, function(err, hash) {
        // Store hash in your password DB.
        params.firstName = req.body.firstName;
        params.lastName = req.body.lastName;
        params.isAdmin = req.body.isAdmin;
        params.phoneNumber = req.body.phoneNumber;
        params.pledgeClass = req.body.pledgeClass;
        params.greekCode = req.body.greekCode;
        params.streetName = req.body.streetName;
        params.city = req.body.city;
        params.state = req.body.state;
        params.zipCode = req.body.zipCode;
        params.email = req.body.email;
        params.password = hash;
        models.User.create(params, function(err, user) {
          if (err) {
            res.status(400).json({
              success: false,
              error: err.message
            });
          } else {
            res.json({
              success: true,
              user: user
            });
          }
        });
      });
    });
  });

  // Beyond this point the user must be logged in
  router.use(function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        success: false,
        error: 'not authenticated'
      });
    } else {
      next();
    }
  });
  router.get('/logout', function(req, res) {
    req.logout();
    res.json({
      success: true,
      message: 'logged out.'
    });
  });

  router.get('/login/success', function(req, res) {
    var user = _.pick(req.user, 'username', '_id');
    res.json({
      success: true,
      user: user
    });
  });

  router.get('/users', function(req, res) {
    User.find(function(err, users) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          users: users.map(_.partial(_.pick, _, ['username', '_id']))
        });
      }
    });
  });



  return router;
};
