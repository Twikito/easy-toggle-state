const
	babel   = require('rollup-plugin-babel'),
	uglify  = require('rollup-plugin-uglify'),
	license = require('rollup-plugin-license');

const banner = [
	' -------------------------------------------------------------------',
	' <%= pkg.name %>',
	' <%= pkg.description %>',
	'',
	' @version v<%= pkg.version %>',
	' @link <%= pkg.homepage %>',
	' @license <%= pkg.license %> : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE',
	' -------------------------------------------------------------------'
].join('\n');

const getFileName = (version = 'es5', isMin = false) => {
	const base = 'easy-toggle-state';
	const ext = isMin ? '.min.js' : '.js';
	if (version === 'es6') {
		return `${base}.es6${ext}`;
	}
	return `${base}${ext}`;
};

const getBabelConfig = (version = 'es5') => {
	if (version === 'es5') {
		return {
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
	}
	return {};
};

const getPlugins = (version = 'es5', isMin = false) => {
	const babelConfig = getBabelConfig(version);
	const list = [
		babel(babelConfig)
	];
	isMin ? list.push(uglify()) : list.push(license({ banner }));
	return list;
};


const getConfig = () => {
	const isMinify = process.env.OUT_STYLE === 'min';
	const plugins = getPlugins(process.env.NODE_ENV, isMinify);
	const fileName = getFileName(process.env.NODE_ENV, isMinify);
	return { fileName, plugins };
};

const { fileName, plugins } = getConfig();

export default {
	input: 'src/index.js',
	output: {
		file: `dist/${fileName}`,
		format: 'iife',
		name: 'easyToggleState'
	},
	plugins
};
