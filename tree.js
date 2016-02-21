
var tree = require('txtm-FileTree')('/media/pi/128GB_FAT');

console.log(JSON.stringify(tree.getData(), null, 2));
