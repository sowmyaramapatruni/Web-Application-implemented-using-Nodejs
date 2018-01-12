
var mysql  = require('mysql');
var conf = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var modelHelper = require('../helper_files/modelHelper.js');
var connectionPool = require('../helper_files/connectionPool.js');

con_pool=connectionPool.pool(1);
function save_one(fields,callback){
	var insert_string = modelHelper.fetchinsert("AIRPLANES_INFO",fields);
	con_pool.query(insert_string,function(error,rows,fields){

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
		insert_stmts.push( modelHelper.fetchinsert("AIRPLANES_INFO",arr_fields[i]) );
	}
	modelHelper.save_bulk(connectionPool,insert_stmts,callback,batchSize);
}
module.exports = {"save_one":save_one, "save_bulk":save_bulk};