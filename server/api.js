"use strict";
var response = require('./response');
var express = require('express');
var router = express.Router();
//var http = require('requestify');
var docdbUtils = require('./lib/docdbUtils');
var R = require('ramda');
var userSettings = require('./lib/userSettings');
var userLocations = require('./lib/userLocations');

 
 
//Inpure Code
var createVMPromise = R.pipe(docdbUtils.createVM, (val) => Promise.resolve(val));
var forcastCalc = R.composeP(createVMPromise, docdbUtils.showForcastByLongLat, R.head,  docdbUtils.getLatLongByZip);
var groupStateZip = R.composeP(userSettings.makecityArray, userSettings.groupByZip,docdbUtils.getStateLocations);
//************************* 

 //For testing
router.get('/api/helloWorld', function (req, res) 
{ 
    res.send('Hell World!!'); 
});

router.get('/api/states', response.renderRequest(userSettings.getStates));
router.get('/api/stateZips/:id', response.renderParamRequest(groupStateZip));
router.get('/api/zip/:id', response.renderParamRequest(forcastCalc));

router.get('/api/userLocation/:id', response.renderParamRequest(userLocations.getUserLocations));
router.post('/api/userLocation', response.handlePost(userLocations.addUserLocation));
router.delete('/api/userLocation/:id', response.renderParamRequest(userLocations.deleteUserLocation));

module.exports = router;