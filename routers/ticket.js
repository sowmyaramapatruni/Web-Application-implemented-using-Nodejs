var express = require('express')
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/Parser.js');
var connectionPool = require('../helper_files/connectionPool.js');
var ticket_model = require('../models/tickets.js');
const rand_str = require('uuid');
var router = express.Router()
console.log("Received request to book ticket")
router.post("/",function(req, res){
	var json_object= req.body
	console.log(json_object);
	console.log(typeof json_object);
	var schedules = json_object["schedules"];
	var passengers = json_object["passengers"];
	var class_id = json_object["class_id"];
	var user_id  = req.user["ID"];
	console.log("user id is "+req.user["ID"]);
	var r_str = rand_str();
	var rstr=r_str.toString().split("-");
	var b_id=rstr[0];
	var tickets = [];
	var fare_data = [];
    for(var i = 0 ; i < schedules.length; i++){
		tickets.push({"SCHEDULE_ID":schedules[i],"status":"BOOKED","BOOKING_ID":b_id,"CLASS_ID":class_id,"USER_ID":parseInt(user_id),ord:(i+1)});
		fare_data.push({"CLASS_ID":class_id, "SCHEDULE_ID":schedules[i]});
	}
	var passengers_data = []
	for(var i = 0 ; i < passengers.length; i++){
		var name = passengers[i]["name"]
		var phone_num = passengers[i]["phone_num"]
		var email = passengers[i]["email"];
		var isPrimary = passengers[i]["is_primary"];
		if(!isPrimary){
			isPrimary = 0;
		}
		if(typeof email === 'undefined'){
			email = ""
		}
		if(typeof phone_num === 'undefined'){
			phone_num = ""
		}
		passengers_data.push({"BOOKING_ID":b_id, "NAME": name, "PHONE_NUM":phone_num, "EMAIL":email, "IS_PRIMARY":isPrimary});
	}
	console.log("In ticket booking page");
	console.log(b_id);
	ticket_model.make_booking(tickets,passengers_data,fare_data,function(success){
		if(success){
			res.send({"status":"success", "booking_id":b_id});
		}else{
			res.send({"status":"failed"});
		}
	});
});
module.exports = router

