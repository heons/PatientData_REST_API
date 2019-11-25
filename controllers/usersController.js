'use strict';

var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  Users = require('../models/Users');

exports.register = function(req, res) {
  var newUser = new Users(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      res.send(400, { message: err });
    } else {
      user.hash_password = undefined;
      res.send(201, user);
    }
  });
};

exports.sign_in = function(req, res) {
  Users.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      console.log(req.body);
      res.send(401, { message: 'Authentication failed. Invalid user or password.' });
    } else {
      res.send(200, { token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
    }
  });
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send(401, { message: 'Unauthorized user!' });
  }
};

