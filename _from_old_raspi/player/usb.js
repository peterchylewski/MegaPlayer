'use strict';

// start web server

var web = require('SimpleWebServer')(__dirname + '/public', 8080, { document: 'usb.html' });


// start web socket

var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var value = 50,
	min = 0,
	max = 100,
	incr = 1;
			
io.on('connection', function(socket) {
	console.log('a user connected');
	
	socket.emit('welcome', 'foo');
	
	startUSB(socket);
	
	socket.on('ready', function(msg) {
		console.log('client ready, message: ' + msg);
	});
	
	socket.on('data', function(data) {
		//console.log(data);
		//value = data;
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(3000, function() {
	console.log('socket listening on *:3000');
});


function startUSB(socket) {
	// start usb stuff

	var usb = require('USBStreamReader');
	usb.on('keyPress', function(event) {
		console.log('keyPress', event);
		socket.emit('keyPress', event.name);
	});
	usb.on('keyDown', function(event) {
		console.log('keyDown', event);
		socket.emit('keyDown', event.name);
	});
	usb.on('keyUp', function(event) {
		console.log('keyUp', event);
		socket.emit('keyUp', event.name);
	});
	usb.on('wheelSpin', function(direction) {
		//console.log('wheelSpin', direction);
		switch (direction) {
			case 'left':
				value = value > min ? value - incr : min;
			break;
			case 'right':
				value = value < max ? value + incr : max;
			break;
		}
		socket.emit('data', value);
	});
}


