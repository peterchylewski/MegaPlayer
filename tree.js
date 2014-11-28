
var tree = require('tm-FileTree')();
//console.log(JSON.stringify(tree, null, 2));
//return;

var x = tree.walk('/media/music');

console.log(JSON.stringify(x, null, 2));