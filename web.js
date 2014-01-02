var express = require('express');
var http = require('http');
var path = require('path');
var new_topic = require('./routes/new_topic.js');
var new_top_level = require('./routes/new_top_level.js');
var edit_top_level = require('./routes/edit_top_level.js');
var delete_top_level = require('./routes/delete_top_level.js');
var top_level = require('./routes/top_level.js');
var main_page = require('./routes/main_page.js');

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

app.get('/',load_model,main_page.get);
app.get('/toplevel/new',load_model,new_top_level.get);
app.post('/toplevel/new',load_model,new_top_level.post);
app.get('/toplevel/:id/delete',load_model,delete_top_level.get);
app.post('/toplevel/:id/delete',load_model,delete_top_level.post);
app.get('/toplevel/:id/edit',load_model,edit_top_level.get);
app.post('/toplevel/:id/edit',load_model,edit_top_level.post);
app.get('/toplevel/:id/page',load_model,top_level.get);
app.post('/topic/new',load_model,new_topic.post);
//app.get('/:year/results', load_model, overall_results.get);


var port = process.env.PORT || 9090;
app.listen(port, function() {
  console.log("Listening on " + port);
});
