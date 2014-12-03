'use strict';

var MUSIC_HOME = '/media/music',
	player = require('node-mplayer');
	
//player.play(MUSIC_HOME + '/Avessos.mp3', { volume: 30 });
player.play('http://swr-mp3-m-swr2.akacast.akamaistream.net/7/721/137135/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr2', { volume: 30 });


var min = 1, max = 100, incr = 1, value = 30;

var usb = require('USBStreamReader');
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