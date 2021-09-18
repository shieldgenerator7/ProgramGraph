"use strict"
//2019-04-04: copied from https://stackoverflow.com/a/41550669/2336212

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/')); //__dir and not _dir
var port = 8000; // you can use any port
app.listen(port);
console.log('server on ' + port);