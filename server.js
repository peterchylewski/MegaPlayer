'use strict';

var MUSIC_HOME = '/media/music',
	keypress = require('keypress'), // http://stackoverflow.com/questions/17470554/how-to-capture-the-arrow-keys-in-node-js
	fs = require('fs'),
	exec = require('child_process').exec,
	app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	stations = require('./radiostations.json'),
	musictree = require('./musictree.json'),
	player = require('SimplePlayer'),
	_config,
	_socket;


function loadConfig() {
	var pathToConfig = __dirname + '/config.json';
	console.log('trying to load config file', pathToConfig, '...');
	_config = fs.existsSync(pathToConfig) === true ? require(pathToConfig) : {};
	console.log('_config', _config);
}

function saveConfig() {
	console.log('saving configuration...');
}

function reloadTree() {
	var tree = require('txtm-FileTree')(MUSIC_HOME, { addDates: true });
	//console.log(JSON.stringify(tree.getData(), null, 2));
	var fs = require('fs');
	fs.writeFile(__dirname + '/musictree.json', JSON.stringify(tree.getData(), null, 2), 'utf8', function(err) {
		if (err !== null) { throw err; return; }
		console.log('file "musictree.json" has been sucessfully written.');
		fs.readFile(__dirname + '/musictree.json', 'utf8', function(data) {
			console.log('data', data);
			var json = JSON.parse(data);
			console.log('json', json);
			_socket.emit('musictree', tree.getData());
		});
	});
}

function startCatchingKeyboardEvents() {
	
	var stdin = process.stdin,
		stdout = process.stdout;
	
	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	//player.setAutoInfoInterval(1000);
	
	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
		console.log('got "keypress"', key);
		switch (key.name) {
			case 't':
				reloadTree();
			break;
			case 'down':
				player.next();
			break;
			case 'c':
				if (key.ctrl === true) { quit(); }
			break;
			case 'q':
				quit();
			break;
		}
	});
}

function startCatchingUSBEvents() {
	var usb = require('USBStreamReader');
	usb.on('keyUp', function(event) {
		//console.log('keyUp', event);
		switch (event.name) {
			case 'KEY_VOLUMEUP':
				player.volumeUp(1);
			break;
			case 'KEY_VOLUMEDOWN':
				player.volumeDown(1);
			break;
			case 'KEY_UP':
				player.prev();
				_socket.emit('previous_station');
			break;
			case 'KEY_DOWN':
				_socket.emit('next_station');
			break;
			case 'KEY_MUTE':
				player.mute();
			break;
			case 'KEY_STOP':
				player.stop();
			break;
			case 'KEY_TAB':
				player.pause();
			break;
			case 't':
				player.getInfo();
			break;
		}
	});
	usb.on('wheelSpin', function(direction) {
		//console.log('wheelSpin', direction);
		switch (direction) {
			case 'left':
				player.volumeDown(1);
			break;
			case 'right':
				player.volumeUp(1);
			break;
		}
	});
}

function quit() {
	console.log('quitting...');
	console.log(player.getInfo());
	saveConfig();
	exec('killall node mplayer', function() {
		process.exit(0);
	});
	return;
	player.stop(function() {
		console.log('player stopped.');
		//io.close();
		process.exit(0);
	});
}

loadConfig();
startCatchingKeyboardEvents();	
startCatchingUSBEvents();
	
	
// ---------- start socket

io.on('connection', function(socket) {
	console.log('a user connected');
	
	_socket = socket;
	
	socket.emit('welcome', 'the server says: welcome!');
	
	player.on('valueChanged', function(key, value) {
		socket.emit('player_value_changed', key, value);
	});
	player.on('end_of_file_reached', function() {
		console.log('player says: end of file reached');
		socket.emit('end_of_file_reached');
	});

	socket.on('ready', function(msg) {
		console.log('client ready, message: ' + msg);		
		socket.emit('radiostations', stations);
		socket.emit('musictree', musictree);
	});
	
	socket.on('volume', function(value) {
		player.setVolume(value, false);
	});
	
	socket.on('station', function(id) {
		console.log('station:', stations[id]);
		
		socket.emit('station_id', id);
		socket.emit('station_message', stations[id].name);
		
		player.play(stations[id].stream_url);
		
		player.on('station_message', function(msg) {
			socket.emit('station_message', msg);
		});
	});
	
	socket.on('file', function(file) {
		console.log('file', file);
		player.start(file);
		player.on('foo', function(msg) {
			socket.emit('station_message', msg);
		});
		
	});
	
	socket.on('cmd', function(cmd) {
		console.log('cmd', cmd);
		switch (cmd) {
			case 'stop':
				player.stop();
			break;
			case 'reloadTree':
				reloadTree();
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

var web = require('SimpleWebServer')(__dirname + '/public', 8080);