const fs = require("fs");
const path = require("path");

// Demo path
const demosPath = path.join('docs', 'assets', 'js');

// Get demo list
const demos = fs.readFileSync(path.join(demosPath, 'demos.json'));
const json = JSON.parse(demos);

// Get template file list
[...fs.readdirSync(path.join('docs', 'assets', 'js', 'templates'))].forEach(file => {

	// Template path
	const templatePath = path.join(demosPath, 'templates', file);

	// Get file name
	const name = path.basename(templatePath, path.extname(templatePath));

	// Convert template into base64 to avoid encodage issue and add it in Json
	json[name].demo = fs.readFileSync(templatePath).toString('base64');
});

// Write Json file
fs.writeFileSync(path.join(demosPath, 'demos.json'), JSON.stringify(json, null, '\t'));

console.log(json);
