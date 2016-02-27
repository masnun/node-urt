#!/usr/bin/env node

var monitor = require("./cli");


/*
 var host = "5.135.165.34";
 var port = 27001;
 var duration = 1000;
 */


var server = process.argv[2] || "urtbd.com:1111";
var duration = process.argv[3] || 1000;

var parts = server.split(":");
var host = parts[0];
var port = parts[1];

monitor.configure({
    'host': host,
    'port': port,
    'duration': duration
});

monitor.start();

