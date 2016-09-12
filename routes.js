"use strict";

var bcrypt = require('bcrypt');
var express = require('express');
var models = require('./models');
var User = models.User;
var Event = models.Event;
var Chapter = models.Chapter;
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

  router.get('/user/:userId', function(req, res) {
    User.findOne({"_id": req.params.userId}, function(err, user) {
      if (err) {
        res.status(500).json({
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

  router.put('/user/:userId', function(req, res) {
    User.findOne({"_id": req.params.userId}, function(err, user) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        for(var key in user) {
          if (req.body[key]) {
            user[key] = req.body[key];
          }
        };
        user.save(function(err, savedUser) {
          res.json({
            success: true,
            user: savedUser
          });
        })
      }
    });
  });

  router.delete('/user/:userId', function(req, res) {
    User.remove({"_id": req.params.userId}, function(err) {
      if (err) {
        res.json({
          success: false,
        });
      } else {
        res.json({
          success: true,
        });
      }
    })
  });

  router.get('/events/:greekCode', function(req, res) {
    Event.find({"greekCode": req.params.greekCode}, function(err, events) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          events: events
        });
      }
    });
  });

  router.get('/event/:greekCode/:eventId', function(req, res) {
    Event.findOne({"greekCode": req.params.greekCode, "_id": req.params.eventId}, function(err, event) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          event: event
        });
      }
    });
  });

  router.post('/events/:greekCode/:eventId', function(req, res) {
    var e = new Event({
      title: req.body.title,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endtime,
      location: req.body.location,
      greekCode: req.params.greekCode,
      users: []
    }).save(function(err, event) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          event: event
        });
      }
    });
  });

  router.put('/event/:greekCode/:eventId', function(req, res) {
    Event.findOne({"greekCode": req.params.greekCode, "_id": req.params.eventId}, function(err, event) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        for(var key in event) {
          if (req.body[key]) {
            event[key] = req.body[key];
          }
        };
        event.save(function(err, savedEvent) {
          res.json({
            success: true,
            event: savedEvent
          });
        })
      }
    });
  });

  router.delete('/event/:eventId', function(req, res) {
    Event.remove({"_id": req.params.eventId}, function(err) {
      if (err) {
        res.json({
          success: false,
        });
      } else {
        res.json({
          success: true,
        });
      }
    })
  });

  router.get('/chapters', function(req, res) {
    Chapter.find(function(err, chapters) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          chapters: chapters
        });
      }
    });
  });

  router.get('/chapter/:greekCode', function(req, res) {
    Event.findOne({"_id": req.params.greekCode}, function(err, chapter) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          chapter: chapter
        });
      }
    });
  });

  router.post('/chapter', function(req, res) {
    var c = new Event({
      title: req.body.title,
      announcements: [],
      expiration: req.body.expiration
    }).save(function(err, chapter) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        res.json({
          success: true,
          chapter: chapter
        });
      }
    });
  });

  router.put('/chapter/:greekCode', function(req, res) {
    Event.findOne({"greekCode": req.params.greekCode}, function(err, chapter) {
      if (err) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      } else {
        for(var key in chapter) {
          if (req.body[key]) {
            chapter[key] = req.body[key];
          }
        };
        chapter.save(function(err, savedChapter) {
          res.json({
            success: true,
            chapter: savedChapter
          });
        })
      }
    });
  });

  router.delete('/chapter/:greekCode', function(req, res) {
    User.remove({'greekCode': req.params.greekCode})
        .then(function() {
          return Event.remove({'greekCode': req.params.greekCode})
        })
        .then(function() {
          return Chapter.remove({'greekCode': req.params.greekCode})
        })
        .then(function(response) {
          res.json({
            success: true
          });
          })
        .catch(function(err) {
          res.json({
            success: false
          });
        });
  });

  return router;
};
