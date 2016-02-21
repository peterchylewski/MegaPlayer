'use strict';

var MegaPlayerClient = function(options) {
	console.log('MegaPlayerClient!');
	
	var _self = this,
		_options = $.extend({}, options),
		_socket = io(_options.host),
		_events = new EventEmitter2();
	
	function _init() {
		console.log('_options', _options);
		_addSocketEvents();
		
		$(document).ready(function() {
			console.log('*** MegaClient: document ready');
			_events.emit('alert', 'document ready');
		});
		
	}			
	
	function _addSocketEvents() {
		console.log('_socket', _socket);
		_socket.on('connection', function(msg) {
			console.log('connection', msg);
		});
	}
	//_socket.on('player_value_changed', 	function(key, value) { console.log('player value changed:', key, value); });	
			
	_init();
}

