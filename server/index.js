"use strict";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var api = require('./api');
var app = express();
var webpackMiddleware;
var webpack;
var wpconfig;


/*
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};
*/
 
// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
//app.use(express.static(__dirname));
app.set('port', process.env.PORT || 9000);
app.use('/', api);


console.log('****************************************************** Environment: '  + app.get('env'));

if ( app.get('env') === 'development')
{
  console.log('******************* Using web pack dev server **********************************');
   webpackMiddleware = require('webpack-dev-middleware');
   webpack = require('webpack');
   wpconfig = require('../webpack.config');
   app.use(webpackMiddleware(webpack(wpconfig), {
      publicPath: "/",
      headers: {"X-Custom_Webpack_Header": "yes" },
      stats : { colors: true }
   }
   ));
}


 var server = app.listen(app.get('port'), 

 function (err) {

  if (err) {
    console.log('Error: ' + err);
  }
   console.log('Express server listening on port ' + server.address().port);
  
});



module.exports = app;