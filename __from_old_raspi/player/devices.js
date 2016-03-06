
var exec = require('child_process').exec,
	child;

child = exec('cat /proc/bus/input/devices',
	function (error, stdout, stderr) {
		if (error !== null) { console.log('exec error: ' + error); }
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		parse(stdout);
	}
);

function parse(s) {
	var blocks = s.split('\n\n'), block,
		lines, line, matches;
	
	for (var j = 0; j < blocks.length; j++) {
		console.log('block ' + j + ' ------------------------');
		block = blocks[j];
		lines = block.split('\n');
		console.log('number of lines: ' + lines.length);
		for (var i = 0; i < lines.length; i++) {
			line = lines[i];
			console.log('*',  line);
			matches = line.match(/(^[A-Z]:)(.*)$/g);
			//console.log(matches);
		}
	}
}