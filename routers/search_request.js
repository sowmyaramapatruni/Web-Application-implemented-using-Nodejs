var express = require('express')
var logger = require('../helper_files/logger.js');
var selectParser = require('../helper_files/parser.js');
var user = require('../models/users.js');
var hash_gen = require('../helper_files/hash_generator.js');
var passport = require('passport');
var router = express.Router()


router.use(function log_time (req, res, next) {
  console.log("Received the search request");
  console.log('Time: ', Date.now())
  next();
})

router.get('/', function(req, res){
	res.render('front',{});
})

module.exports = router