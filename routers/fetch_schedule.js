var express = require('express')
var mysql      = require('mysql');
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/parser.js');
var connectionPool = require('../helper_files/connectionPool.js');
var connectionPool2 = require('../helper_files/connectionPool2.js');
var conf = require('../config_files/config_database1.js');
var wait=require('wait.for');
var router = express.Router()
console.log("in schedule Request");
var result1=0;


//middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    console.log("finally In the schedule request clicked");
    next()
})
//define the home page route

function handle(req, res){
  
    console.log(req.query.start_date);
    console.log(req.query.num_passenger);
    console.log( req.query.class);
    console.log(req.query.source_airport_id);
    console.log(req.query.dest_airport_id);
    var start_date = req.query.start_date;
    var return_date = req.query.returnDate;
    var seats = req.query.num_passenger;
    var clas = req.query.class;
    var source_airport_id = req.query.source_airport_id;
    var dest_airport_id = req.query.dest_airport_id;
    var trip_type = req.query.tripType;




    var connection = mysql.createConnection({
        host     : conf.host,
        user     : conf.user,
        password : conf.password,
        database : conf.database
    });



    console.log(connection);
    var result1=0;


    dbsetup = "select * from (select * from airports where id="+source_airport_id+" or id="+dest_airport_id+") as s where s.country='United States'";
    var rows = wait.forMethod(connection, 'query', dbsetup);
    result1 = rows.length;

    console.log("********");
    console.log(result1);
    console.log("********");

    res.set({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": '*'
    });
    if(trip_type == 'round'){
        console.log("Trip type: Round Trip");
        var final_result = [];
        getFlights(result1,start_date,seats,clas,source_airport_id,dest_airport_id,function(result){
            final_result.push(result);
            getFlights(result1,return_date,seats,clas,dest_airport_id,source_airport_id,function(result){
                final_result.push(result);
                console.log(final_result);
                res.render('schedules',{ result_data:final_result, trip_type: trip_type, class_type: clas,"passenger_count":seats})
            });
        });}else{
        getFlights(result1,start_date,seats,clas,source_airport_id,dest_airport_id,function(result){
            res.render('schedules',{ result_data:result, trip_type: trip_type, class_type: clas,"passenger_count":seats})
        });
    }
}

router.get('/', function (req, res) {
    wait.launchFiber(handle, req, res);
});

function getFlights(resl,start_date,seats,clas,s_airport_id,d_airport_id,callback){
    var date = start_date.split("-");
    var date_object = new Date(date[0],date[1]-1,date[2]);
    var date_string = format(date_object);
    var temporary_date = new Date(date[0],date[1]-1, date[2]);
    temporary_date.setDate(temporary_date.getDate()+3);
    var end_date_string = format(temporary_date);


    if(resl==2){
        con_pool=connectionPool.pool(2);
        console.log("Connection for domestic flights");
        console.log(con_pool);
    }
    else{
        con_pool=connectionPool.pool(1);
        console.log("Connection for international flights");
        console.log(con_pool);
    }
    console.log("   ");
    console.log(date_string);
    console.log(end_date_string);
    console.log(seats);
    console.log(clas);
    console.log(s_airport_id);
    console.log(d_airport_id);
    console.log("   ");


    queryString = "select distinct fare,airlines.name as airline_name,shortId,schedule_id,airplane__id,sor.IATA as source,des.IATA as dest,starttime,endtime from (select route.airline_id, route.SOURCE_AIRPORT_ID as s_id, route.DEST_AIRPORT_ID as d_id, route.airline as shortId, schedule.id as schedule_id, airplanes.airplane_id as airplane__id,schedule.starttime,schedule.endtime,FARES_SEATS.num_fare as fare from schedule join FARES_SEATS on schedule.airplane_id = FARES_SEATS.SCHEDULE_ID join airplanes on schedule.airplane_id = airplanes.id join route on route.id = airplanes.route_id join airlines on route.airline_id = airlines.id where schedule.starttime > '$starttime' and schedule.endtime < '$endtime' and FARES_SEATS.CLASS_ID = $class and FARES_SEATS.NUM_SEATS >= $seats and route.SOURCE_AIRPORT_ID = $s_airport_id and route.DEST_AIRPORT_ID = $d_airport_id) s join airlines on s.airline_id = airlines.ID join airports sor on s.s_id = sor.id join airports des on s.d_id = des.id;"

    queryString = queryString.replace('$starttime',date_string);
    queryString =queryString.replace('$endtime',end_date_string);
    queryString =queryString.replace('$seats',seats);
    queryString =queryString.replace('$class',clas);
    queryString =queryString.replace('$s_airport_id',s_airport_id);
    queryString =queryString.replace('$d_airport_id',d_airport_id);

    console.log(queryString);
    con_pool.query(queryString,function(error,rows, fields){
        if(!error){
            var result = formated_date(rows);
            console.log(result);
            callback(result);

        }else{
            console.log("Encountered an error");
            console.log(error);
            callback(null);
        }
    });

}
function format(date){
    var format_str = "";
    format_str = format_str+date.getFullYear();

    if(date.getMonth()+1 < 10){
        format_str = format_str+"-"+"0"+(date.getMonth()+1);
    }else{
        format_str = format_str+"-"+(date.getMonth()+1);
    }

    if(date.getDate() < 10){
        format_str = format_str+"-"+"0"+(date.getDate());
    }else{
        format_str = format_str+"-"+(date.getDate());
    }

    if(date.getHours()<10){
        format_str = format_str+" "+"0"+(date.getHours());
    }else{
        format_str = format_str+" "+(date.getHours());
    }

    if(date.getMinutes() < 10){
        format_str = format_str+":"+"0"+(date.getMinutes());
    }else{
        format_str = format_str+":"+(date.getMinutes());
    }

    if(date.getSeconds() < 10){
        format_str = format_str+":"+"0"+(date.getSeconds());
    }else{
        format_str = format_str+":"+(date.getSeconds());
    }
    return format_str;
}




function formated_date(rows){
    var result = []
    for(var i = 0 ; i < rows.length; i++){
        var return_object = {}
        return_object["airline"] = rows[i]["airline_name"]
        return_object["flight_id"] = rows[i]["shortId"]+"-"+rows[i]["airplane__id"]
        return_object["sourceIATA"] = rows[i]["source"];
        return_object["destinationIATA"] = rows[i]["dest"];
        return_object["route_id"] = rows[i]["schedule_id"];
        var departDate  = rows[i]["starttime"];

        return_object["departDate"] = departDate.slice(0,16).replace(/-/g,'/')

        var arrivalDate = rows[i]["endtime"]
        return_object["arrivalDate"] = arrivalDate.slice(0,16).replace(/-/g,'/')


        return_object["fare"] = "$"+rows[i]["fare"]
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