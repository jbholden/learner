var express = require('express');
var http = require('http');
var path = require('path');
var index = require('./routes/index.js');

var app = express();

var fs = require('fs');
var logFile = fs.createWriteStream(__dirname + "/public/logs/learn.log", {flags:'a'});

app.use(express.logger({stream: logFile}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser("some secret"));  // must come before bodyparser
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.cookieSession());

app.set('models',require('./models'));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.param('wknum');

var load_model = function(req,res,next) {
   res.locals.models = app.get('models');
   next();
};

app.get('/',index.get);
//app.get('/:year/results', load_model, overall_results.get);


var port = process.env.PORT || 9090;
app.listen(port, function() {
  console.log("Listening on " + port);
});
