'use strict';

var MUSIC_HOME = '/media/music';

var stations = require('./radiostations.json');

var _socket;

var fs = require('fs'),
	path = require('path'),
	flac = require('flac-metadata');  // https://github.com/claus/flac-metadata

var player = require('SlavePlayer');

player.on('valueChanged', function(key, value) {
	console.log('value changed:', key, value);
	switch (key) {
		case 'path':
			extractMetaData(value);
		break;
		case 'radioMessage':
			if (_socket !== undefined) {
				_socket.emit('station_message', value);
			}
		break;
	}
});

function extractMetaData(filePath) {
	console.log('extractMetaData', filePath);
	var extension = path.extname(filePath).replace(/^./, '');	
	switch (extension) {
		case 'flac':
			var reader = fs.createReadStream(filePath),
				processor = new flac.Processor({ parseMetaDataBlocks: true });
			processor.on('postprocess', function(mdb) {
				console.log('*', mdb.toString());
			});
			reader.pipe(processor);
		break;
	}
}

// trying to capture events from /dev/input/by-id/usb-flirc.tv_flirc-event-kbd
	
var usb = require('USBStreamReader');
usb.on('keyPress', function(event) {
	console.log('keyPress', event);
	switch (event.name) {
		case 'KEY_VOLUMEUP':
			player.volumeUp();
		break;
		case 'KEY_VOLUMEDOWN':
			player.volumeDown();
		break;
		case 'KEY_SPACE':
			player.pause();
		break;
		case 'l':
			player.playList('/media/music/Donald Fagen/Sunken Condos (2012) 24-88.2-FLAC/playlist');
		break;
		case 'KEY_POWER_MATE':
		case 'm':
			player.mute();	
		break;
		case 'KEY_LEFT':
			player.prev();
		break;
		case 'KEY_RIGHT':
			player.next();
		break;
		case 'KEY_STOP':
			player.stop();
		break;
		case 'KEY_SHUTDOWN':
			quit();
		break;
	}
});
usb.on('wheelSpin', function(direction) {
	switch (direction) {
		case 'left': player.volumeDown(); break;
		case 'right': player.volumeUp(); break;
	}
});


// trying to capture events from /dev/input/by-id/usb-flirc.tv_flirc-event-kbd (end)
function usbKeyboardEvents() {

	var stdin = process.stdin,
		stdout = process.stdout,
		keypress = require('keypress'); // http://stackoverflow.com/questions/17470554/how-to-capture-the-arrow-keys-in-node-js

	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
		console.log('got "keypress"', key);
		switch (key.name) {
			case 'up':
				player.volumeUp();	
			break;
			case 'down':
				player.volumeDown();	
			break;
			case 'left':
				player.prev();	
			break;
			case 'right':
				player.next();	
			break;
			case 'm':
				player.mute();	
			break;
			case 't':
				var tree = require('tm-FileTree')(MUSIC_HOME, { addDates: true });
				console.log(JSON.stringify(tree.getData(), null, 2));
			break;
			case 'r':
				player.stop();
				player.play('http://wdr-3-320.akacast.akamaistream.net/7/827/119437/v1/gnl.akacast.akamaistream.net/wdr-3-320');
			break;
			case 'l':
				player.playList('/media/music/Donald Fagen/Sunken Condos (2012) 24-88.2-FLAC/playlist');
			break;
			case 'space':
			case 'p':
				player.pause();
			break;
			case 'c':
				if (key.ctrl === true) { quit(); }
			break;
			case 'q':
				quit()
			break;
		}
		
		if (key && key.ctrl && key.name == 'c') {
			//process.stdin.pause();

		}
	});
}

usbKeyboardEvents();

function setupSockets() {
	var app = require('express')(),
		http = require('http').Server(app),
		io = require('socket.io')(http);
		
	io.on('connection', function(socket) {
		console.log('a user connected');
		_socket = socket;
		
		socket.emit('welcome', 'welcome');
		
		socket.on('ready', function(msg) {
			console.log('client ready, message: ' + msg);
			socket.emit('radiostations', stations);
		});
	
		socket.on('station', function(id) {
			console.log('station:', stations[id]);
		
			socket.emit('station_id', id);
			socket.emit('station_message', stations[id].name);
		
			player.pause();
			player.play(stations[id].stream_url);
		
			
		});
	
		socket.on('cmd', function(cmd) {
			switch (cmd) {
				case 'stop':
					player.stop();
				break;
			}
		});

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
	});
    http.listen(3000, function() {
		console.log('listening on *:3000');
	});
}

setupSockets();

var web = require('SimpleWebServer')(__dirname + '/public', 8080);

function quit() {
	player.quit(function() {
		console.log('player stopped');
		io.close();
		process.exit(0);
	});

}

