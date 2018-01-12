var express = require('express')
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/parser.js');
var User = require('../models/users.js');
var hash_gen = require('../helper_files/hash_generator.js');
var router = express.Router()

//log function showing the time of running the request
router.use(function log_time (req, res, next) {
  console.log("Received request for user registration")
  console.log('Time: ', Date.now())
  next();
})

//pushing data into the user info table
router.post("/",function(req,res){
	console.log(req.body);
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var fields = {}
	fields["username"] = username;
	fields["email"] = email
	fields["password"] = hash_gen.hash(password);
	User.save_fields(fields,function(error,rows){
		if(!error){
			res.send("Successful user registration");

		}
	});
});

module.exports = router;