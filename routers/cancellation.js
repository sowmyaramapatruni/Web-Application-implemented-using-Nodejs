var express = require('express')
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/parser.js');
var connectionPool = require('../helper_files/connectionPool.js');
var model_ticket = require('../models/tickets.js');
var router = express.Router()
console.log("Received a request for cancellation");
router.post("/",function(req, res){
    var json_object= req.body
    console.log(json_object);
    console.log(typeof json_object);
    var booking_id = json_object["booking_id"];
    model_ticket.make_cancellation(booking_id,function(success){

        if(success){
            res.send({"status":"success", "booking_id":booking_id});
        }else{
            res.send({"status":"failed"});
        }
    });
});

con_pool1=connectionPool.pool(1);

router.get("/",function(req,res){
    var query_string = 'select status,BOOKING_ID,sor.IATA as source,des.IATA as dest,starttime,endtime,airlines.name as airline_name,shortId,airplane__id from (SELECT tickets.status,TICKETS.BOOKING_ID,ROUTE.SOURCE_AIRPORT_ID AS s_id,ROUTE.DEST_AIRPORT_ID as d_id,route.AIRLINE_ID, route.airline as shortId,airplanes.airplane_id as airplane__id,schedule.starttime,schedule.endtime FROM TICKETS JOIN SCHEDULE ON TICKETS.SCHEDULE_ID = schedule.ID JOIN AIRPLANES ON SCHEDULE.AIRPLANE_ID = airplanes.ID JOIN ROUTE ON airplanes.ROUTE_ID = ROUTE.ID where tickets.user_id = $user_id) s join airports sor on s.s_id = sor.ID join airports des on s.d_id = des.ID join airlines on s.AIRLINE_ID = airlines.id'
    query_string = query_string.replace("$user_id",req.user["ID"]);
    con_pool1.query(query_string, function(error, rows){


        if(!error){
            var formated_result = formated_date(rows);
            console.log(formated_result);
            res.render('cancel',{ cancel_result_data:formated_result})
        }else{
            console.log("ENCOUNTERED ERROR");
            console.log(error);
            res.send('encountered error');
        }

    });
})
function format(date){
    var format_string = "";
    format_string = format_string+date.getFullYear();

    if(date.getMonth()+1 < 10){
        format_string = format_string+"-"+"0"+(date.getMonth()+1);
    }else{
        format_string = format_string+"-"+(date.getMonth()+1);
    }

    if(date.getDate() < 10){
        format_string = format_string+"-"+"0"+(date.getDate());
    }else{
        format_string = format_string+"-"+(date.getDate());
    }

    if(date.getHours()<10){
        format_string = format_string+" "+"0"+(date.getHours());
    }else{
        format_string = format_string+" "+(date.getHours());
    }

    if(date.getMinutes() < 10){
        format_string = format_string+":"+"0"+(date.getMinutes());
    }else{
        format_string = format_string+":"+(date.getMinutes());
    }

    if(date.getSeconds() < 10){
        format_string = format_string+":"+"0"+(date.getSeconds());
    }else{
        format_string = format_string+":"+(date.getSeconds());
    }
    return format_string;
}
function formated_date(rows){
    var result = []
    for(var i = 0 ; i < rows.length; i++){
        var return_object = {}
        return_object["airline"] = rows[i]["airline_name"]
        return_object["flight_id"] = rows[i]["shortId"]+"-"+rows[i]["airplane__id"]
        return_object["sourceIATA"] = rows[i]["source"];
        return_object["destinationIATA"] = rows[i]["dest"];
        return_object["BOOKING_ID"] = rows[i]["BOOKING_ID"];
        return_object['status'] = rows[i]['status']
        var departDate  = rows[i]["starttime"];

        return_object["departDate"] = departDate.slice(0,16).replace(/-/g,'/')

        var arrivalDate = rows[i]["endtime"]
        return_object["arrivalDate"] = arrivalDate.slice(0,16).replace(/-/g,'/')
        return_object["duration"] = get_duration(rows[i]["starttime"], rows[i]["endtime"]);
        return_object["stops"] = "non stop";
        result.push(return_object);
    }
    return result;
}
function get_duration(start_str, end_str){
    var start_date_obj = getDateObj(start_str);
    var end_date_obj = getDateObj(end_str);
    var timeDiff = Math.abs(end_date_obj.getTime() - start_date_obj.getTime());
    var minutes_diff = timeDiff/(1000*60);
    var hours = minutes_diff/60;
    var minutes = minutes_diff%60;
    return hours+"hrs"+" "+minutes+"mins"
}
function getDateObj(date_str){
    var splits = date_str.split(' ');
    var date_splits = splits[0].split('-');
    var time_splits = splits[1].split(':');
    return new Date(date_splits[0], date_splits[1]-1, date_splits[2], time_splits[0], time_splits[1]);
}
module.exports = router

