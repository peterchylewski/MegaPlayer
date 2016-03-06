var exec = require('child_process').exec;

exec('sudo iwconfig wlan0 | grep Link | sed s/\/100//g | tr \'=\' \' \' | awk \'{printf "{\"link\":"$3",\"signal\":"$6",\"noise\":"$9"}"}\'', function(err, stdout, stderr) {
	console.log(err);
	console.log(stdout);
	console.log(stderr);
});