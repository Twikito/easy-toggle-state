const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

module.exports =  {
	input: 'src/index.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		name: 'easyStateToggle'
	},
	plugins: [
		nodeResolve(),
		babel(),
		commonjs(),
		uglify()
	]
};
