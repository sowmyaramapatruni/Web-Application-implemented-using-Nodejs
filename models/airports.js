var mysql      = require('mysql');
var config = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});
function fetch_all(columns,options,callback){
	if(!columns || !columns.length > 0){
		columns = [];
		columns.push('id');
		columns.push('name');
	}
	var select_string = "select ";
	for(var i = 0 ; i < columns.length-1; i++){
		select_string = select_string + columns[i]+", ";
	}
	if(columns.length > 0){
		select_string = select_string + columns[i];
	}
	var from_string = "from airports";
	var query_string = select_string+" "+from_string;
	logger.log('info','About to execute Query '+query_string);
	connection.query(query_string,function(error,rows,fields){

		callback(error,rows,fields);
	});
}
var exports = {"fetch_all": fetch_all};
module.exports = exports;