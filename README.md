# Web-Application-implemented-using-Nodejs

 Developed a web application to allow concurrent ticketing transactions on airline database.
 Provided load balancing support by hosting multiple databases on diﬀerent servers. Technologies: Node.js, Express.js, MySQL and Bootstrap.
 
 
## Description

Using this website user can able to register, login, search for a flights, book the tickets and cancel the tickets.

1. Technology Stack

2. Backend Server -> Nodejs

3. Authentication -> Passport.js

4. Rest Framework -> Express.js

5. Logging -> winston(not at all happy with this lib)

6. Node Database Driver -> mysql

7. DataBase -> MySQL

8. Frontend -> jquery, bootstrap

## Set up
Install nodejs and mySql database server

Change your database connectivity details in ./config/db_conf.js

Update first database details in config_database1 and the other one in config_database2

## How to Run
Run node application.js You change port in application.js

open browser and hit http://ipaddress:port/skyline

## Functional Requirements

1. The registration page allows the user to register with email id and password, and to specify
other contact details required for the registration.

2. The login page allows the user to sign in with the user credentials.

3. The search page allows the user to search for flights based on the source airport, destination
airport, category, type of trip and date of trip. Only on successful login can a user search for
flights.

4. The search request should be redirected to the relevant database, based on if it’s a domestic
flight or an international flight.

