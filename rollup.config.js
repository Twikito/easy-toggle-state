const
	license     = require('rollup-plugin-license'),
	commonjs    = require('rollup-plugin-commonjs'),
	nodeResolve = require('rollup-plugin-node-resolve'),
	babel       = require('rollup-plugin-babel'),
	uglify      = require('rollup-plugin-uglify');

const header = [
	'	-------------------------------------------------------------------',
	'	<%= pkg.name %>',
	'	<%= pkg.description %>',
	'',
	'	@version v<%= pkg.version %>',
	'	@link <%= pkg.homepage %>',
	'	@license <%= pkg.license %> : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE',
	'	-------------------------------------------------------------------'
].join('\n');

const getConfig = () => {

	let suffix      = '',
		fileName    = '',
		babelConfig = {};

	if (process.env.OUT_STYLE === 'min')
		suffix = '.min';

	if (process.env.NODE_ENV === 'es5') {
		fileName = `easyToggleState${suffix}.js`,
		babelConfig = {
			"presets": [
				[
					"env",
					{
						"modules": false
					}
				]
			],
			"plugins": ["external-helpers"]
		}
	}

	if (process.env.NODE_ENV === 'es6') {
		fileName = `easyToggleState.es6${suffix}.js`
	}

	let plugins = [
		nodeResolve(),
		commonjs(),
		babel(babelConfig),
		license({ banner: header })
	]

	if (process.env.OUT_STYLE === 'min')
		plugins.push( uglify() );

	return { fileName, plugins };
};

const { fileName, plugins = {}} = getConfig();

module.exports = {
	input: 'src/index.js',
	output: {
		file: `dist/${fileName}`,
		format: 'iife',
		name: 'easyToggleState'
	},
	plugins: plugins
};
