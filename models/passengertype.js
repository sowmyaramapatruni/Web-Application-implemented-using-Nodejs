var mysql  = require('mysql');
var config = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var modelHelper = require('../helper_files/modelHelper.js');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password,
  database : config.database
});
function save_one(fields,callback){
	var insert_string = modelHelper.getInsertStatement("PASS_TYPE",fields);
	connection.query(insert_string,function(error,rows,fields){

		if(error){
			logger.log('info','Query Execution Failed'+error);
			callback(error); 
		}else{
			callback(null,rows[0]);
		}
	});
}
function save_bulk(arr_fields,callback,batchSize){
	insert_stmts =[]
	for(var i = 0 ; i < arr_fields.length; i++){
		insert_stmts.push( modelHelper.fetchinsert("PASS_TYPE",arr_fields[i]) );
	}
	modelHelper.save_bulk(connection,insert_stmts,callback,batchSize);
}
module.exports = {"save_one":save_one, "save_bulk":save_bulk};