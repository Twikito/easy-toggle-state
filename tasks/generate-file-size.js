const fs = require("fs");
const path = require("path");
const gzip = require('gzip-size');

let json = {};

// Get dist file list
[...fs.readdirSync('dist')].forEach(file => {

	// Get file stats
	const stats = fs.statSync(path.join('dist', file));

	// Get gzipped file size
	const gzipSize = gzip.sync(fs.readFileSync(path.join('dist', file)));

	// Keep only file type for json key, i.e. 'es6.min.js'
	json[file.substring(file.indexOf('.')+1)] = { 'default': stats.size, 'gzipped': gzipSize };
});

// Write Json file
fs.writeFileSync(path.join('docs', 'filesize.json'), JSON.stringify(json));

console.log(json);
