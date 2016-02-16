var MegaPlayer = function() {
	
	console.log('MegaPlayer!');
	
	var MUSIC_HOME = '/media/music',
		_stations = require('./radiostations.json'),
		_mplayer = require('node-mplayer');
	
	function _init() {
		_mplayer.play(_stations.wdr3.stream_url, { volume: 10 });
		//_mplayer.play('http://swr-mp3-m-swr2.akacast.akamaistream.net/7/721/137135/v1/gnl.akacast.akamaistream.net/swr-mp3-m-swr2', { volume: 30 });
		_bindings();
	}
	
	function _bindings() {
			
		// ----------------- bash keyboard
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
					_mplayer.setVolume('up');
				break;
				case 'down':
					_mplayer.setVolume('down');
				break;
				case 'm':
					_mplayer.mute();
				break;
				case 'c':
					if (key.ctrl === true) { _quit(); }
				break;
				case 'q':
					_quit();
				break;
			}
		});
	
		// ----------------- USB
		
		var usb = require('USBStreamReader');
		
		usb.on('keyDown', function(event) {
			console.log('keyDown', event);
			switch (event.name) {
				case 'KEY_POWER_MATE':
					_mplayer.mute();
				break;
			}
		});
		usb.on('wheelSpin', function(direction) {
			//console.log('wheelSpin', direction);
			switch (direction) {
				case 'left':
					_mplayer.setVolume('down');
				break;
				case 'right':
					_mplayer.setVolume('up');
				break;
			}

		});
	}
	
	function _quit() {
		console.log('quitting....');
		_mplayer.destroy();
		process.exit(0);
	}

	
	
	_init();
};

var megaPlayer = new MegaPlayer();