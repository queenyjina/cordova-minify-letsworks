#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var cwd = process.cwd(); // Current working directory is /project/node_modules/cordova-minify/
var scriptPath = __dirname;

var paths = [ path.join(cwd, '..', '..', 'hook') ];

// If paths do not exist, make them.
for(var pathIndex in paths) {
	if(!fs.existsSync(paths[pathIndex])) {
		console.log('Creating directory: ', paths[pathIndex])
		fs.mkdirSync(paths[pathIndex]);
	}
}

// Absolute Location of our cordova-minify.js file
var minifyFilePath = path.join(cwd, 'hook', 'minify.js');

// Copy our minify script to the cordova hooks folder.
var minifyFile = fs.readFileSync(minifyFilePath);
console.log('Grabbing Minifier File from minify package in node_modules');
var minifyFileNewPath = path.join(paths[0], 'minify.js');
console.log('Copying Minifier File to Cordova ./hook/minify.js');
fs.writeFileSync(minifyFileNewPath, minifyFile);

console.log('Finished set-up! Your JS, CSS, HTML, and img files will be automatically compressed, and your JS files uglified!');
