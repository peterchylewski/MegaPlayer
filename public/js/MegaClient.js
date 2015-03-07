'use strict';

var MegaClient = function() {

	var _self = this,
		_serverSocketURL = 'http://192.168.1.200:3000/',
		_socket = io(_serverSocketURL),
		_events = new EventEmitter2();
			
	console.log('MegaClient!');
	
	_socket.on('connection', 	function(msg) { console.log(msg); });
	//_socket.on('player_value_changed', 	function(key, value) { console.log('player value changed:', key, value); });
		
	$(document).ready(function() {
		console.log('*** MegaClient: document ready');
		_events.emit('alert', 'document ready');
	});
			
}

