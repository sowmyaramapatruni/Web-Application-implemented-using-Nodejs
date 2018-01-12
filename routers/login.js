var express = require('express')
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/parser.js');
var User = require('../models/users.js');
var hash_gen = require('../helper_files/hash_generator.js');
var passport = require('passport');
var router = express.Router()

//log function showing the time of running the request
router.use(function log_time (req, res, next) {
  console.log("received login request");
  console.log('Time: ', Date.now())

  next();
})

router.post('/', passport.authenticate('local-signin', {
        successRedirect : '/skyline/search', // on successful login, redirect to search page
        failureRedirect : '/skyline', // on invalid credentials, redirect to same page
        failureFlash : true // allowing flash messages
    }));
module.exports = router