"use strict";
 
var express = require('express');
var router = express.Router();
//**************** 

 //For testing
router.get('/api/helloWorld', function (req, res) 
{ 
    res.send('Hell World 2'); 
});


module.exports = router;