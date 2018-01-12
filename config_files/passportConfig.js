var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/users.js');
var hash_gen = require('../helper_files/hash_generator.js');
var logger = require('../helper_files/logger.js');
//user is serialized and deserialezed to create a session for the user
function setUpStrategy(passport){
    //function to serialize a user
	passport.serializeUser(function(user, done) {
		console.log('in SerializeUser..');
		console.log(user)
        done(null, user["ID"]);
    });
	//function to deserialize the user
    passport.deserializeUser(function(id, done) {
		console.log('in SerializeUser..');
        User.fetch_columns(["*"], ["id","$eq",id], function(err, user) {
            if(!err){
            	console.log(user[0])
				done(err,user[0]);
			}else{
				console("I dont know failed..");
			}
        });
    });
	//function to authenticate using the passport local sign-in strategy  
	passport.use('local-signin',new LocalStrategy({
		usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
	},function(req, email, password, callback){
		process.nextTick(function(){
			logger.log('info','About to check the authentication with '+email+"and password as "+password);
			console.log('About to check the authentication with '+email+"and password as "+password);
			User.fetch_columns(["*"], ["email","$eq",email],function(err,rows){
				if(rows.length == 0){
					logger.log('info','email does not exist in database');
					console.log('email does not exist in database')
					callback(null,false);
				}else{
					console.log(rows);
					console.log(rows[0]["PASSWORD"]);
					if( hash_gen.compHash(rows[0]["PASSWORD"], password) ){
						logger.log('info','Authentication succesful');
						callback(null,rows[0]);
					}else{
						logger.log('info','User Password invalid');
						console.log('User Password invalid');
						callback(null,false);
					}
				}
			});
		});
	}));
}
module.exports = setUpStrategy;