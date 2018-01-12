var express = require('express')
var logger = require('../helper_files/logger.js');
var parser = require('../helper_files/parser');
var model_airports = require('../models/airports.js');
var router = express.Router()


router.use(function time_log (req, res, next) {
  console.log('Time: ', Date.now());
  next()
})

router.get('/', function (req, res) {
  logger.log('info','got request to fetch Airports');
  logger.log('info','select statement is'+req.query["$select"]);
  res.set({
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": '*'
  });
  model_airports.fetch_all(parser(req.query["$select"]),{},function(error,rows,fields){
	res.send(rows);
  });
});
module.exports = router