function selectParser(string_name){
  var result = [];
  if(typeof string_name == 'string'){
     var columns  = string_name.split(",");
	 return columns;
  }
}
module.exports = selectParser;