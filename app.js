"use strict";

var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local');
var util = require('util');
// var FacebookStrategy = require('passport-facebook');

var User = require('./models');
var routes = require('./routes');

// Make sure we have all required env vars. If these are missing it can lead
// to confusing, unpredictable errors later.
var REQUIRED_ENV = ['SECRET', 'MONGODB_URI'];
REQUIRED_ENV.forEach(function(el) {
  if (!process.env[el])
    throw new Error("Missing required env var " + el);
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI);
var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});
app.use(session({
  secret: process.env.SECRET || 'fake secret',
  store: mongoStore
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
  if (! util.isString(username)) {
    console.log('Login failed. Username is not a string', username);
    done(null, false);
    return;
  }
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.error(err);
      done(err);
      return;
    }
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      done(null, false, { message: 'Incorrect username.' });
      return;
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      done(null, false, { message: 'Incorrect password.' });
      return;
    }
    // auth has has succeeded
    done(null, user);
    return;
  });
}));

// passport.use(new FacebookStrategy({
//     clientID: process.env.FB_CLIENT_ID,
//     clientSecret: process.env.FB_CLIENT_SECRET,
//     callbackURL: process.env.callbackURL
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("Error: " + err.message + "\n" + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("Error: " + err.message);
});

module.exports = app;
