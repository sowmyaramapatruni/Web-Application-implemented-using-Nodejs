var mysql = require('mysql');
var conf = require('../config_files/config_database1.js');
var conf2 = require('../config_files/config_database2');

var pool1  = mysql.createPool({
    connectionLimit : conf.connectionLimit,
    host     : conf.host,
    user     : conf.user,
    password : conf.password,
    database : conf.database
});

var pool2 = mysql.createPool({
    host     : conf2.host,
    user     : conf2.user,
    password : conf2.password,
    database : conf2.database
});
function poolObj(int1){
    if(int1==2){
        return pool2;
    }else {
        return pool1;
    }
}
module.exports = {"pool": poolObj};