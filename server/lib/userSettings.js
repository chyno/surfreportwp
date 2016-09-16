
"use strict";
 var R = require('ramda');
var data = require('./data');

var UserSettings = {
        
    groupByZip : R.groupBy(function(reading) {
       return  reading.city;
    }),

    makecityArray : R.curry((data) =>  {
        var array = [];
        for (var k in data)
        {
            if (data.hasOwnProperty(k))
            {
                let tmp = {city: k, locations: data[k]};
                array.push(tmp);
            }
        }
        return array
    }),
    
   
    
    getStates() {
      return  new Promise( (resolve) => { resolve(data.getStates()) });
    }
}

module.exports = UserSettings;