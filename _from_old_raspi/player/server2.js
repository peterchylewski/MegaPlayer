#!/opt/node-v0.10.2-linux-arm-pi/bin/node

'use strict';

var MegaPlayer = function() {

	var MUSIC_HOME = '/media/music',
		_mplayer = require('node-mplayer');
	
	function _init() {
		_bindings();
		_mplayer.play('http://swr-mp3-m-swr2.akacast.akamaistream.net/7/721/137135/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr2', { volume: 30 });
		
	}
	
	function _bindings() {
	
	}
	
	_init();
};

var megaPlayer = new MegaPlayer();




//console.log(process.argv);

var MUSIC_HOME = '/media/music',
	player = require('node-mplayer');
	
//player.play(MUSIC_HOME + '/Avessos.mp3', { volume: 30 });
player.play('http://swr-mp3-m-swr2.akacast.akamaistream.net/7/721/137135/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr2', { volume: 30 });


// ------------------- keyboard (bash)

var stdin = process.stdin,
	stdout = process.stdout,
	keypress = require('keypress'); // http://stackoverflow.com/questions/17470554/how-to-capture-the-arrow-keys-in-node-js

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	console.log('got "keypress"', key);
	switch (key.name) {
		case 'up':
			
		break;
		case 'down':
			
		break;
		case 'c':
			if (key.ctrl === true) { quit(); }
		break;
		case 'q':
			quit();
		break;
	}
});


// ------------------- USB

var min = 1, max = 100, incr = 1, value = 30;

var usb = require('USBStreamReader');
usb.on('keyDown', function(event) {
	console.log('keyDown', event);
	switch (event.name) {
		case 'KEY_POWER_MATE':
			player.mute();
		break;
	}
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
	console.log(value);
	player.setVolume(value);
	//socket.emit('data', value);
});


/*
// Start reading from stdin so we don't exit.
process.stdin.resume();

process.on( 'SIGINT', function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	// some other closing procedures go here
	process.exit();
});

*/

function quit() {
	io.close();
	process.exit(0);
}
