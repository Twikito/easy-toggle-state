const
	commonjs    = require('rollup-plugin-commonjs'),
	nodeResolve = require('rollup-plugin-node-resolve'),
	babel       = require('rollup-plugin-babel'),
	uglify      = require('rollup-plugin-uglify');

const getConfig = () => {
	if (process.env.NODE_ENV === 'es5') {
		return {
			fileName: 'easyToggleState.js',
			babelConfig: {}
		};
	}
	if (process.env.NODE_ENV === 'es6') {
		return {
			fileName: 'easyToggleState.es6.js',
			babelConfig: {}
		};
	}
};

const { fileName, babelConfig = {}} = getConfig();

module.exports = {
	input: 'src/index.js',
	output: {
		file: 'dist/${fileName}',
		format: 'iife',
		name: 'easyToggleState'
	},
	plugins: [
		nodeResolve(),
		babel(babelConfig),
		commonjs()
		//uglify()
	]
};
