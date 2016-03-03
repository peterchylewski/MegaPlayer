
var tree = require('txtm-FileTree')('/media/music');

console.log(JSON.stringify(tree.getData(), null, 2));