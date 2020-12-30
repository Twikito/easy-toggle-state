const babel = require("rollup-plugin-babel"),
	{ terser } = require("rollup-plugin-terser"),
	license = require("rollup-plugin-license"),
	replace = require("rollup-plugin-replace");

const getBanner = isMin => {
	if (isMin) {
		return '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= moment().format("YYYY") %> <%= pkg.author %> | <%= pkg.license %> License | <%= pkg.homepage %> */';
	} else {
		return [
			" -------------------------------------------------------------------",
			" <%= pkg.name %>",
			" <%= pkg.description %>",
			"",
			" @author <%= pkg.author %>",
			" @version v<%= pkg.version %>",
			" @link <%= pkg.homepage %>",
			" @license <%= pkg.license %> : https://github.com/Twikito/easy-toggle-state/blob/master/LICENSE",
			" -------------------------------------------------------------------"
		].join("\n");
	}
};

const getFileName = (version = "es5", isMin = false) => {
	const base = "easy-toggle-state";
	const ext = isMin ? "min.js" : "js";
	if (version === "es5") {
		return [base, "es5", ext].filter(Boolean).join(".");
	}
	return [base, ext].filter(Boolean).join(".");
};

const getBabelConfig = (version = "es5") => {
	if (version === "es5") {
		return {
			presets: [
				['@babel/preset-env', {
					'modules': false,
					'targets': {
						'browsers': [
							'last 2 versions'
						]
					}
				}]
			]
		};
	}
	return {};
};

const getPlugins = (version = "es5", isMin = false) => {
	const babelConfig = getBabelConfig(version);
	const list = [];
	if (version === "es5") list.push(babel(babelConfig));
	if (isMin) list.push(terser());
	list.push(license({ banner: getBanner(isMin) }));
	return list;
};

const getPreferConst = (version = "es5") => version === "es6";

const getConfig = () => {
	const isMinify = process.env.OUT_STYLE === "min",
		fileName = getFileName(process.env.NODE_ENV, isMinify),
		preferConst = getPreferConst(process.env.NODE_ENV),
		plugins = getPlugins(process.env.NODE_ENV, isMinify);
	return { fileName, preferConst, plugins };
};

const { fileName, preferConst, plugins } = getConfig();

export default {
	input: "src/index.js",
	output: {
		file: `dist/${fileName}`,
		format: "iife",
		name: "easyToggleState",
		preferConst
	},
	plugins,
};
