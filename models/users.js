var mysql      = require('mysql');
var conf = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var connection = mysql.createConnection({
  host     : conf.host,
  user     : conf.user,
  password : conf.password,
  database : conf.database
});

function save_fields(fields,callback){
	var columns = "("
	var values = "VALUES ("
	var fields_Keys = Object.keys(fields);
	for(var i = 0 ; i < fields_Keys.length-1; i++){
		columns = columns + fields_Keys[i]+", ";
		values =values+"'"+fields[fields_Keys[i]]+"', "
	}
	if( fields_Keys.length > 0){
		columns = columns + fields_Keys[i];
		values = values+"'"+fields[fields_Keys[i]]+"'";
	}
	columns = columns + ") "
	values = values + ") ;"
	var query_string = "INSERT INTO USERINFO "+columns+" "+values;
	logger.log('info','About to execute Query '+query_string);
	connection.query(query_string,function(error,rows,fields){
		if(error){
			logger.log('info','Query Execution Failed'+error);
			callback(error);
		}else{
			callback(null,rows[0]);
		}
	});
}

function fetch_columns(fields,condition,callback){
	var condition = fetchquerycondition(condition);
	var selectClause = "select "
	for(var i  = 0 ; i < fields.length-1; i++){
	  selectClause = selectClause + fields[i]+", ";
	}
	if(fields.length > 0){
		selectClause = selectClause+fields[i];
	}
	var final_query = selectClause + " from userinfo where "+condition+";";
	logger.log('info','about to execute the Query '+final_query);
	console.log('about to execute the Query '+final_query);
	connection.query(final_query,function(error,rows,fileds){
		if(error){
			logger.log('info','Query Execution Failed '+error);
			console.log('Query Execution Failed '+error);
			callback(error);
		}else{
			callback(null,rows);
		}
	});
}

function fetchquerycondition(condition){
   var connectors = {"$AND":{"type":"binary","const":"AND"},"$OR":{"type":"binary","const":"OR"}};
   var operators = {"$gt":{"const":">"},"$gte":{"const":">="},"$lt":{"const":"<"},"$lte":{"const":"<="},"$eq":{"const":"="}};
   if(condition instanceof Array){
	   var connector = condition[0];
	   if(connectors[connector]){
		   return "( "+fetchquerycondition(condition[1])+ " "+connectors[connector]["const"]+" "+fetchquerycondition(condition[2])+" )"
	   }else{
		 var key = condition[0];
		 var operator = condition[1];
		 var value = condition[2];
		 var finalStr = key+"";
		 finalStr =finalStr + operators[operator]["const"];
		 if(typeof value == 'string'){
			 finalStr = finalStr + "'"+value+"'"
		 }
		 else{
			 finalStr = finalStr +value;
		 }
		 return finalStr;
	   }
   }
}
var exports = {"save_fields":save_fields,"fetch_columns":fetch_columns};
module.exports = exports;
