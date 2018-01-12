globals = {}
globals.pass = {"adults":1, "children": 0,"infants":0};
globals.source = ""
globals.destination = ""
var resultToken = true; // for form validation

		function incrementPassCount(){
		   var id = $(this).attr('id');
		   if(id == "inc_a"){
		     var res_id = "num_a";
			 globals.pass.adults++;
			 var res_val = globals.pass.adults;
		   }else if(id == "inc_c"){
		     var res_id = "num_c";
			 globals.pass.children++;
			 res_val = globals.pass.children;
		   }else{
		      var res_id = "num_f";
			  globals.pass.infants++;
			  res_val = globals.pass.infants;
		   }
		   $('#'+res_id).val(res_val+"");
		}

function decrementPassCount(){
   var id = $(this).attr('id');
   if(id == "dec_a"){
    var res_id = "num_a";
	  globals.pass.adults--;
	  var res_val = globals.pass.adults;
   }
   else if(id == "dec_c"){
	  var res_id = "num_c";
	  globals.pass.children--;
		res_val = globals.pass.children;
	 }
   else{
     var res_id = "num_f";
     globals.pass.infants--;
     res_val = globals.pass.infants;
	  }
		$('#'+res_id).val(res_val+"");
}

function defaultPassCount(){
  $('#num_a').val("1");
  $('#num_c').val("0");
  $('#num_f').val("0");
  globals.pass = {};
  globals.pass.adults = 1;
  globals.pass.children = 0;
  globals.pass.infants = 0;
}
function httpGetAsync(theUrl, callback){
             var xmlHttp = new XMLHttpRequest();
             xmlHttp.onreadystatechange = function(){ 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                 callback(xmlHttp.responseText);
            }
            xmlHttp.open("GET", theUrl, true); // true for asynchronous 
            xmlHttp.send(null);
}
$(function() {
  var citiesSource = [
    "(BWI) Baltimore", "(NYC) New York", "(NJ) New Jersey", "(DFW) Dallas", "(BOS) Boston"
  ];
  httpGetAsync("http://localhost:8081/skyline/airports?$select=name,id",function(res){
        var result = [];
        res = JSON.parse(res);
        for(var i = 0 ; i < res.length; i++){
          var x = {};
        x["label"] = res[i]["name"];
        x["id"] = res[i]["id"];
        result.push(x);
        }
        $('#source').autocomplete({
    source: result,
    minLength: 3,
    select: function(event, ui){
      globals.source = ui.item.id
    }
    });
    $('#destination').autocomplete({
    source: result,
    minLength: 3,
    select: function(event, ui){
      globals.destination = ui.item.id
    }
  });
    console.log("fetched and return populated for autosearch");
});


  
	
  $('.date-picker').datepicker();
  $('.flight-class').selectmenu();


	$('#inc_a').click(incrementPassCount);
	$('#inc_c').click(incrementPassCount);
	$('#inc_f').click(incrementPassCount);
	$('#dec_a').click(decrementPassCount);
	$('#dec_f').click(decrementPassCount);
	$('#dec_c').click(decrementPassCount);
	defaultPassCount();

$('input[name=tripType]').change(function(){
  $(".returnDateContainer").show();
  var value = $('input[name=tripType]:checked').val();
  if(value=='oneway'){
    $(".returnDateContainer").hide();
  }
});


$('.sf-modify').on( "click", function( event ) {
  $('.sf-results').fadeOut('slow', function(){
    $('.sf-modify').fadeOut(100, function(){
      $('.search-flights').fadeIn('slow');
    });
  });
});




$('.sf-submit').on('click', function( event ) {
  resultToken=true;
  event.preventDefault();
  $('.val-error').removeClass("val-error");

  var paramsArr = $('form').serialize().split('&');
  var dataObj = {};
  //pushing data from paramsArr to dataObj
  console.log("Logging paramsArr");
  console.log(paramsArr);
  for(var i=0; i<paramsArr.length; i++){
    if(paramsArr[i].split('=')[0]=='source'){
      dataObj['sourceIATA']=paramsArr[i].split('=')[1].split(')+')[0].split('(')[1];
    }
    else if(paramsArr[i].split('=')[0]=='destination'){
      dataObj['destinationIATA']=paramsArr[i].split('=')[1].split(')+')[0].split('(')[1];
    }
    else{
      dataObj[paramsArr[i].split('=')[0]]=paramsArr[i].split('=')[1]
    }
  }
  var num_passenger = 0;
  var class_id;
  var departDate;
  var params = paramsArr;
  var tripType;
  var returnDate;
  for(var i = 0 ; i < params.length; i++){
     var items = params[i].split("=");
     if(items[0] == 'infants' || items[0] == 'adults' || items[0] == 'children'){
         num_passenger = num_passenger + parseInt(items[1]);
     }else if(items[0] == 'flightClass'){
        if(items[1] == 'Economy'){
            class_id = 1;
        }else if(items[1] == 'Premium'){
             class_id = 2;
        }else{
             class_id = 3;
        }
     }else if(items[0] == 'departDate'){
        var date = unescape(items[1]);
        var date_arr = date.split("/");
        var new_date_arr = [];
        new_date_arr[0] = date_arr[2];
        new_date_arr[1] = date_arr[0]
        new_date_arr[2] = date_arr[1];
        departDate = new_date_arr.join("-");    
     }else if(items[0] == 'tripType'){
        tripType = items[1]
     }else if(items[0] == 'returnDate'){
        if(items[1]){
         var date = unescape(items[1]);
        var date_arr = date.split("/");
        var new_date_arr = [];
        new_date_arr[0] = date_arr[2];
        new_date_arr[1] = date_arr[0]
        new_date_arr[2] = date_arr[1];
        returnDate = new_date_arr.join("-");  
        }
     }
  }
  var query_param = "tripType="+tripType+"&"+"start_date="+departDate+"&"+"source_airport_id="+globals.source+"&"+"dest_airport_id="+globals.destination+"&"+"class="+class_id+"&"+"num_passenger="+num_passenger;
  if(returnDate){
    query_param = query_param+"&"+"returnDate="+returnDate;
  }
  console.log("final query_param is"+query_param);
  console.log(dataObj);

  var dataURL=$.param(dataObj);
  console.log(dataURL);


  var resultURL = "/skyline/schedules?"+query_param;

  if(resultToken){
    $('.search-flights').fadeOut('slow', function(){
      $('.sf-modify').fadeIn('slow');
      $('.sf-results').fadeIn('slow', function(){
          $('.sf-results').load(resultURL, function(){


        });
      });
    });
  }
});

$('.sf-cancel').on('click', function( event ) {
  resultToken=true;


    var resultURL = "/skyline/cancel?";
  if(resultToken){
    $('.search-flights').fadeOut('slow', function(){
      $('.sf-results').fadeIn('slow', function(){

        $('.sf-results').load(resultURL, function(){

        });
      });
    });
  }
});

$('.sf-home').on('click', function( event ) {
  location.reload();
});

});
