var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var airports = require('./routers/fetch_airports.js');
var register = require('./routers/register.js');
var login = require('./routers/login.js');
var schedule = require('./routers/fetch_schedule.js');
var search = require('./routers/search_request.js');
var passport = require('passport');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var flash    = require('connect-flash');
var tickets = require('./routers/ticket.js');
var cancel = require('./routers/cancellation.js')
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
var application = app.listen(8081, function () {
    var host = application.address().address
    var port = application.address().port
    console.log("Visit skyline application at http://%s:%s", host, port);
});
app.use(express.static('public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cookieParser());
app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var setupPassportStrategy = require('./config_files/passportConfig.js');
setupPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/skyline/airports',airports);
app.use('/skyline/signup',register);
app.use('/skyline/login',login);
app.use('/skyline/schedules',schedule);
app.use('/skyline/search',search);
app.use('/skyline/tickets',tickets);
app.use('/skyline/cancel',cancel);
app.get("/skyline",function(req,res){
    res.render('login',{});
});

