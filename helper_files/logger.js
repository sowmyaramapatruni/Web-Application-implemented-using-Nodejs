var winston = require('winston');
var log_level = require('../config_files/log_conf.js');
winston.add(winston.transports.File, { filename: log_level.file });
winston.remove(winston.transports.Console);
winston.level = log_level.level;
module.exports = winston;