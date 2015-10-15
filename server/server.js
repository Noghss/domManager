// server/app.js

// set up ======================================================================
var express  		= require('express');
var app      		= express();
var port    		= process.env.PORT || 8080;
var mongoose 		= require('mongoose');
var passport 		= require('passport');
var morgan   		= require('morgan');
var cookieParser   	= require('cookie-parser');
var bodyParser   	= require('body-parser');
var session		   	= require('express-session');
var flash    		= require('connect-flash');
var configDB 		= require('./config/database.js');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// body parser is deprecated and need this parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname.split('server')[0] + 'client'));
app.set('views', 'C:/Users/Noghs/domManagerWorkspace/dom-manager/client');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'baconrulez',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

