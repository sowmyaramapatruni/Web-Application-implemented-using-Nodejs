var mysql  = require('mysql');
var config = require('../config_files/config_database1.js');
var logger = require('../helper_files/logger.js');
var modelHelper = require('../helper_files/modelHelper.js');
var connectionPool = require('../helper_files/connectionPool.js');
var connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});
con_pool=connectionPool.pool(1);
function make_booking(tickets,passengers_data,num_fare_data,callback){
    var insert_statements = []
    for(var i = 0 ; i < tickets.length; i++){
        insert_statements.push(modelHelper.fetchinsert("tickets", tickets[i]));
    }
    for(var i = 0 ; i < passengers_data.length; i++){
        insert_statements.push(modelHelper.fetchinsert("passengers", passengers_data[i]));
    }
    for(var i = 0 ; i < num_fare_data.length; i++){
        insert_statements.push(get_update_statement(num_fare_data[i],passengers_data.length));
    }
    book_tickets(insert_statements,callback);
}

function get_update_statement(fields,val){

    //var str = "UPDATE FARES_SEATS SET NUM_SEATS = NUM_SEATS - "+val+" where CLASS_ID="+fields["CLASS_ID"]+" and SCHEDULE_ID="+fields["SCHEDULE_ID"]+";";

    var str = "UPDATE FARES_SEATS SET NUM_SEATS = NUM_SEATS - "+val+" where CLASS_ID="+fields["CLASS_ID"]+" and SCHEDULE_ID=(select airplane_id from schedule where id="+fields["SCHEDULE_ID"]+")"+";";

    var str1 = "UPDATE FARES_SEATS SET NUM_SEATS = NUM_SEATS - "+val+" where CLASS_ID="+fields["CLASS_ID"]+" and SCHEDULE_ID=(select airplane_id from schedule where id="+fields["SCHEDULE_ID"]+")"+";";
    var con_pool2=connectionPool.pool(2);
    con_pool2.query(str1);

    return str;
}

function book_tickets(insert_statements,callback){
    var i = 0 ;
    connection.beginTransaction(function(error){
        if(error){
            callback(false);
        }else{
            recursive();
        }
    })
    function recursive(){
        if( i >= insert_statements.length){
            console.log("Done will all queries about to commit...");
            connection.commit(function(error){
                if(error){
                    callback(false);
                }else{
                    callback(true);
                }
            })
            return;
        }
        console.log("statement about execute book tickets "+insert_statements[i]);
        connection.query(insert_statements[i],function(error,rows){
            if(error){
                console.log("Encountered error"+error);
                connection.rollback(function(error){
                    callback(false);
                })
            }
            else{
                i++;
                recursive();
            }
        });
    }
}
function make_cancellation(booking_id,callback){
    var condition = ["booking_id","$eq",booking_id];
    var select_statement = modelHelper.fetchselect('tickets',["SCHEDULE_ID","CLASS_ID"],condition);
    var select_statement2 = modelHelper.fetchselect('passengers',["count(*) as cont"],condition);
    cancel_tickets([select_statement,select_statement2,get_status_change_update_statement(booking_id)],callback);

}
function get_cancel_update_statement(schedule_id, class_id, passengers){
    var str = "UPDATE FARES_SEATS SET NUM_SEATS = NUM_SEATS + "+passengers+" where CLASS_ID="+class_id+" and SCHEDULE_ID="+schedule_id+";";
    return str;
}
function get_status_change_update_statement(booking_id){
    var str = "UPDATE TICKETS SET STATUS='CANCELLED' where booking_id='"+booking_id+"';";
    return str;
}
function cancel_tickets(insert_statements,callback){
    var i = 0 ;
    var schedule_id = ""
    var class_id = ""
    var passengers_count;
    connection.beginTransaction(function(error){
        if(error){
            callback(false);
        }else{
            stm1(function(success1){
                if(!success1){
                    connection.rollback(function(error){
                        callback(false);
                    })
                    return;
                }
                stmt2(function(success2){
                    if(!success2){
                        connection.rollback(function(error){
                            callback(false);
                        })
                        return;
                    }
                    stmt3(function(success3){
                        if(!success3){
                            connection.rollback(function(error){
                                callback(false);});
                            return;
                        }
                        stmt4(function(success4){
                            if(!success4){
                                connection.rollback(function(error){
                                    callback(false);});
                                return;
                            }
                            connection.commit(function(error){
                                if(error){
                                    callback(false);
                                    return;
                                }
                                callback(true);
                            });
                        })
                    });
                });
            });
        }
    })
    function stm1(callback){
        console.log(insert_statements[0]);
        connection.query(insert_statements[0],function(error,rows){
            if(error){
                callback(false);
                return;
            }
            schedule_id = rows[0]["SCHEDULE_ID"];
            class_id = rows[0]["CLASS_ID"];
            callback(true);
        })
    }
    function stmt2(callback){
        console.log(insert_statements[1]);
        connection.query(insert_statements[1],function(error,rows){
            if(error){
                callback(false);
                return;
            }
            passengers_count = rows[0]["cont"];
            callback(true);
        });
    }
    function stmt3(callback){
        var update_stmt = get_cancel_update_statement(schedule_id,class_id,passengers_count);
        console.log(update_stmt);
        connection.query(update_stmt,function(error,rows){
            if(error){
                callback(false);
            }else{
                callback(true);
            }
        })
    }

    function stmt4(callback){
        console.log(insert_statements[2]);
        connection.query(insert_statements[2],function(error,rows){
            if(error){
                callback(false);
                return;
            }
            callback(true);
        });
    }
}
module.exports = {"make_booking":make_booking,"make_cancellation":make_cancellation}