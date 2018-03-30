const
	license     = require('rollup-plugin-license'),
	commonjs    = require('rollup-plugin-commonjs'),
	nodeResolve = require('rollup-plugin-node-resolve'),
	babel       = require('rollup-plugin-babel'),
	uglify      = require('rollup-plugin-uglify');

const getConfig = () => {

	const
		header = [
			'	-------------------------------------------------------------------',
			'	<%= pkg.name %>',
			'	<%= pkg.description %>',
			'',
			'	@version v<%= pkg.version %>',
			'	@link <%= pkg.homepage %>',
			'	@license <%= pkg.license %> : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE',
			'	-------------------------------------------------------------------'
		].join('\n'),

		babelConfig = {
			'presets': [
				[
					'env',
					{
						'modules': false
					}
				]
			],
			'plugins': ['external-helpers']
		};

	if (process.env.NODE_ENV === 'es5') {
		if (process.env.OUT_STYLE === 'min') {
			return {
				fileName: 'easy-toggle-state.min.js',
				plugins: [
					nodeResolve(),
					commonjs(),
					babel(babelConfig),
					uglify()
				]
			};
		} else {
			return {
				fileName: 'easy-toggle-state.js',
				plugins: [
					nodeResolve(),
					commonjs(),
					babel(babelConfig),
					license({ banner: header })
				]
			};
		}
	}

	if (process.env.NODE_ENV === 'es6') {
		if (process.env.OUT_STYLE === 'min') {
			return {
				fileName: 'easy-toggle-state.es6.min.js',
				plugins: [
					nodeResolve(),
					commonjs(),
					uglify()
				]
			};
		} else {
			return {
				fileName: 'easy-toggle-state.es6.js',
				plugins: [
					nodeResolve(),
					commonjs(),
					license({ banner: header })
				]
			};
		}
	}
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
