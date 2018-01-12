# Web-Application-implemented-using-Nodejs
 Developed a web application to allow concurrent ticketing transactions on airline database.
 Provided load balancing support by hosting multiple databases on diﬀerent servers. Technologies: Node.js, Express.js, MySQL and Bootstrap.
 
 
Description
Using this website user can able to register, login, search for a flights, book the tickets and cancel the tickets.

Technology Stack
Backend Server -> Nodejs
Authentication -> Passport.js
Rest Framework -> Express.js
Logging -> winston(not at all happy with this lib)
Node Database Driver -> mysql
DataBase -> MySQL
Frontend -> jquery, bootstrap
Set up
Install nodejs and mySql database server
Change your database connectivity details in ./config/db_conf.js
Run sql statements in load_data.sql(In mySql shell)(please run in the order of tables created in create_table_scripts)
How to Run
Run node application.js You change port in server.js
open browser and hit 'http://ipaddress:port/skyline'
