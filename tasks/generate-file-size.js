const fs = require("fs");
const path = require("path");

let json = {};

// Get dist file list
[...fs.readdirSync('dist')].forEach(file => {

	// Get stats for each file
	const stats = fs.statSync(path.join('dist', file));

	// Keep only file type for json key, i.e. 'es6.min.js'
	json[file.substring(file.indexOf('.')+1)] = stats.size;
});

// Write Json file
fs.writeFileSync(path.join('docs', 'filesize.json'), JSON.stringify(json));

console.log(json);
