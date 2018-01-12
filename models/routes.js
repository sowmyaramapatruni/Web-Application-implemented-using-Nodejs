var mysql  = require('mysql');
var config = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var modelHelper = require('../helper_files/modelHelper.js');
var connectionPool = require('../helper_files/connectionPool.js');

con_pool=connectionPool.pool(1);
function fetch_columns(fields,condition,callback,offset,limit){
	console.log("limit is"+limit);
   var select_stmt = modelHelper.fetchselect("ROUTE",fields,null,offset,limit);
   con_pool.query(select_stmt,function(error,rows,fields){
	   if(error){
		   callback(error);
	   }else{
		   callback(null,rows);
	   }
   });   
}

function fetch_batch(fields,condition,batchSize){
	var offset = 0;
	var limit = batchSize;
	function fetch(finalCallback){
		fetch_columns(fields,condition,callback,offset,limit);
		function callback(error,rows){
			offset = offset + limit;
			if(error){
				finalCallback(error);
			}else{
				finalCallback(null,rows);
			}
		}
	}
	return fetch;
}

module.exports = {"fetch_batch":fetch_batch, "fetch_columns":fetch_columns};