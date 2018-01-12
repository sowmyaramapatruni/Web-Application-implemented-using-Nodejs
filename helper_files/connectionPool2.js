var mysql = require('mysql');
var conf = require('../config_files/config_database2.js');

var pool2  = mysql.createPool({
    connectionLimit : conf.connectionLimit,
    host     : conf.host,
    user     : conf.user,
    password : conf.password,
    database : conf.database
});

module.exports = pool2;