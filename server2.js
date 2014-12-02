'use strict';

var MUSIC_HOME = '/media/music',
	player = require('node-mplayer');
	
player.setFile(MUSIC_HOME + '/Avessos.mp3');
player.play();
