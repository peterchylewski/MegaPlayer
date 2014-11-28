
var Mplayer = require('node-mplayer'),
    player = new Mplayer('/media/music/Pat\ Metheny\ Group\ -\ Offramp.flac');

player.on('data', function(data) {
	var buff = new Buffer(data);
	console.log("foo: " + buff.toString('utf8'));
});

player.play();




/*
setInterval(function() { 
	player.getTimePosition(function(elapsedTime){
		console.log(elapsedTime);
	});
}, 200);
*/
