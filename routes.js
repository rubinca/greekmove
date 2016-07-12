"use strict";

var express = require('express');
var User = require('./models');
var _ = require('underscore');

module.exports = function (passport) {
  var router = express.Router();

  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        res.status(400).json( {
          success: false,
          error: err.message
        });
      } else if (!user) {
        res.status(401).json( {
          success: false,
          error: info.message
        });
      } else {
        res.json({
          success: true,
          user: user
        });
      }
    })(req, res, next);
  });

  router.post('/register', function(req, res, next) {
    var params = _.pick(req.body, ['username', 'password']);
    User.create(params, function(err, user) {
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

  return router;
};
