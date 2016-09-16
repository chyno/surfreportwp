
"use strict";
var moment = require('moment');
var R = require('ramda');
var database = require('./database');
var http = require('requestify');
var key = "0f9877d63b94697f985124d9cbb9c6cb";
var currentlyPath = R.lensPath(['currently']);
var forecastPath = R.lensPath(['daily', 'data']);
var timeLens = R.lens(R.prop('time'), R.assoc('time'));
var config = require('./config');

var formatDate = R.curry((dt) => {
    return moment.unix(dt).format("MMM Do YYYY")
}); 

function rejectWithLog(reason, fn) {
    //console.error('An error occurred', reason);
    fn(reason);
}

var DocDBUtils = {
    
  getStateLocations (state) {
        var self = this;
        
      var querySpec = {
            query: 'SELECT * FROM c where c.state = @state',
            parameters: [{
                name: '@state',
                value: state
            }]};
            
         return database.runDbQueryAsync(querySpec, config.zipCollectionId);
     },
        
        
    getLatLongByZip(zip) {
        var querySpec = {
            query: 'SELECT * FROM c WHERE c.zip = @zip',
            parameters: [{
                name: '@zip',
                value: zip
            }]
        };
         
        
         return database.runDbQueryAsync(querySpec, config.zipCollectionId);
    },

    showForcastByLongLat(location) {
       // var location = locations[0];
        var lat = location.latitude;
        var long = location.longitude;
        var path = "/forecast/" + key + "/" + lat + "," + long;
        var host = 'https://api.forecast.io';
        var fullpath = host + path;
         //console.log('Host:' + fullpath);
        return new Promise((resolve, reject) => {
            http.get(fullpath).then((response) => {
                let rspBody = response.getBody();
                rspBody.city = location.city;
                rspBody.state = location.state;

                 
                resolve(rspBody);
            }, (reason) => {
               console.log('rejecting ....');
                reject(reason);
            });
        });
    },
    
    createVM :
    R.curry((d) => {
          var vm = {};
          var timeMap = R.over(timeLens, formatDate);
         var curdata = R.view(forecastPath,d);
        
        vm.city = d.city;
       vm.state =d.state;
       vm.forecast =   R.map(timeMap,  curdata);//R.view(forecastPath, d);
        vm.currently =  R.view(currentlyPath, d);
        return vm;
    }),
    
    rejectWithLog: rejectWithLog
};

module.exports = DocDBUtils;
