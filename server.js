//require our dependencies
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var app= express();
var port = 8080;

// Models Section
var db = require('./model/db');
var user = require('./model/users');

//Use ejs express layout
app.set('view engine', 'ejs');
app.use(expressLayouts);

//use body parser
app.use(bodyParser.urlencoded());

//route our app
var router = require('./app/routes');
app.use('/', router);
var users = require('./app/users');
app.use('/users', users);
//set static files css images location
app.use(express.static(__dirname + '/public'))
//start the server
app.listen(port, function(){
	console.log('app started');
});

