

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/static', express.static('public'));

http.listen(3000, function(){
	console.log('listening on *:3000');
});

// ---------- start socket

//var player = require('SimplePlayer');

io.on('connectionli', function(socket) {
	console.log('a user connected');
	
	_socket = socket;
	
	socket.emit('connection', 'the server says: welcome!');
	
	player.on('valueChanged', function(key, value) {
		//console.log('a player value changed', key, value);
		socket.emit('player_value_changed', key, value);
	});
	
	player.on('end_of_file_reached', function() {
		console.log('player says: end of file reached');
		socket.emit('end_of_file_reached');
	});
	
	player.on('audio_info', function(audio) {
		console.log('a player emitted audio info_', audio);
		socket.emit('audio_info', audio);
	});
	
	player.on('station_message', function(msg) {
		socket.emit('station_message', msg);
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
		
	});
	
	socket.on('file', function(file, newPlayer) {
		console.log('file', file, newPlayer);
		player.play(file, newPlayer);
		player.on('station_message', function(msg) {
			socket.emit('station_message', msg);
		});
	});
	
	socket.on('cmd', function(cmd, arg0, arg1, arg2) {
		console.log('cmd', cmd);
		switch (cmd) {
			case 'setStation':
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>setStation', arg0);		
			break;
			case 'stop':
				player.stop();
			break;
			case 'reloadTree':
				reloadTree();
			break;
			case 'setTimePos':
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>setTimePos', arg0);		
				player.setTimePos(arg0, function() { console.log('time pos set?'); });	
			break;
			case 'saveDiscogsInfo':
				var path = arg0, data = arg1;
				fs.writeFile(path + '/_discogs.json', JSON.stringify(data, null, 2), function(err) {
					console.log('err', err);
				});
			break;
			case 'restart':
				spawn('restart', ['megaserver']);
			break;
		}
	});
	
	socket.on('event', function(arg0, arg1, arg2) {
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>event', arg0, arg1);
		socket.emit('event', arg0, arg1);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});