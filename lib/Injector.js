'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Public
// ----------------------------------------

class Injector {
	constructor () {
		/** @private */
		this._custom = {};

		/** @private */
		this._settings = {
			mode: 'production',
			hot: false,
			sourcemaps: false,
			js: null,
			sass: [],
			externals: [],
			outputPath: '',
			outputPublicPath: ''
		};
	}

	/**
	 * Setting wepback.config option `mode`
	 * @param {string} value - production / development / none
	 * @return {Injector}
	 * @see {@link https://webpack.js.org/concepts/mode/}
	 */
	mode (value) {
		if (~['production', 'development'].indexOf(value)) {
			this._settings.mode = value;
		}
		return this;
	}

	/**
	 * Enable/disable HMR
	 * @param {boolean} value
	 * @return {Injector}
	 * @see {@link https://webpack.js.org/concepts/hot-module-replacement/}
	 */
	hot (value) {
		this._settings.hot = !!value;
		return this;
	}

	/**
	 * Enable/disable
	 * @param {string|boolean} value
	 * @return {Injector}
	 */
	sourcemaps (value) {
		this._settings.sourcemaps = value === true ? 'inline-source-map' : value;
		return this;
	}

	/**
	 * @param {string} source
	 * @param {string} dist
	 * @return {Injector}
	 */
	js (source, dist) {
		this._settings.js = {
			source,
			dist,
			name: path.basename(dist, '.js')
		};

		this._settings.outputPath = path.dirname(dist);
		return this;
	}

	/**
	 * @param {string} source
	 * @param {string} dist
	 * @return {Injector}
	 */
	sass (source, dist) {
		this._settings.sass.push({
			source,
			dist,
			name: path.basename(dist, '.css'),
			key: `sass${this._settings.sass.length}`
		});
		return this;
	}

	/**
	 * Setting wezom.config option `output.publicPath`
	 * @param {string} value
	 * @return {Injector}
	 */
	outputPublicPath (value) {
		this._settings.outputPublicPath = value;
		return this;
	}

	/**
	 * Setting wepback.config option `externals`
	 * @param {string|function} module
	 * @param {string|string[]|Object} [value] - if `module` is string
	 * @return {Injector}
	 * @see {@link https://webpack.js.org/configuration/externals/}
	 */
	externals (module, value) {
		if (typeof module === 'function') {
			this._settings.externals.push(module);
		} else {
			this._settings.externals.push({ [module]: value });
		}
		return this;
	}

	/**
	 * Set your own, custom options for config.
	 * They will merged with options defined via injector methods
	 * @param object
	 * @return {Injector}
	 */
	customConfig (object) {
		this._custom = object;
		return this;
	}

	// ------------------------------------------------------
	// Make up the final values ​​for the webpack configuration
	// ------------------------------------------------------

	/**
	 * Exports generated webpack.config from Injector instance
	 * @return {WebpackOptions}
	 */
	exportWebpackConfig () {
		/** @type {WebpackOptions} */
		let config = {
			mode: this.webpackConfigMode,
			externals: this.webpackConfigExternals,
			entry: this.webpackConfigEntry,
			output: this.webpackConfigOutput,
			stats: this.webpackConfigStats,
			devtool: this.webpackConfigDevtool
		};

		return Object.assign({}, config, this._custom);
	}

	/**
	 * @private
	 * @return {WebpackOptions.mode}
	 */
	get webpackConfigMode () {
		return this._settings.mode;
	}

	/**
	 * @private
	 * @return {WebpackOptions.externals}
	 */
	get webpackConfigExternals () {
		return this._settings.externals;
	}

	/**
	 * @private
	 * @return {WebpackOptions.entry}
	 */
	get webpackConfigEntry () {
		if (this._settings.js === null) {
			return null;
		}

		/** @type {WebpackOptions.entry} */
		const entry = {
			[this._settings.js.name]: this._settings.js.source
		};

		this._settings.sass.forEach(file => {
			entry[file.name] = file.source;
		});

		return entry;
	}

	/**
	 * @private
	 * @return {WebpackOptions.output}
	 */
	get webpackConfigOutput () {
		return {
			filename (file) {
				if (/\.(s)?css$/.test(file.chunk.entryModule.resource)) {
					return '_webpack-injector-temp/[name].js';
				}
				return '[name].js';
			},
			path: this._settings.outputPath,
			publicPath: this._settings.outputPublicPath,
			chunkFilename: '_async-chunks/[name].js?=[chunkhash]'
		};
	}

	/**
	 * @private
	 * @return {WebpackOptions.stats}
	 */
	get webpackConfigStats () {
		return {
			colors: true,
			env: true,
			modules: true,
			moduleTrace: false,
			chunkModules: false,
			chunkOrigins: false,
			hash: true,
			reasons: false,
			version: false,
			children: false
		};
	}

	/**
	 * @private
	 * @return {WebpackOptions.devtool}
	 */
	get webpackConfigDevtool () {
		return this._settings.sourcemaps;
	}

	// ----------------------------------
	// FS helpers
	// ----------------------------------

	/**
	 * Remove file from your project
	 * @param {string|string[]} paths
	 * @return {Injector}
	 */
	clearPaths (paths) {
		if (!Array.isArray(paths)) {
			paths = [paths];
		}
		if (paths.length) {
			const cleaner = require('./helpers/clear-path');
			cleaner(paths);
		}
		return this;
	}

	/**
	 * Copy files from `source` to `dist`
	 * @param {Object[]} files
	 * @param {string} files.source
	 * @param {string} files.dist
	 * @param {boolean} [files.onlyIfChanged=true] - copy if the contents of the source and the resulting file are different
	 * @return {Injector}
	 */
	copyFiles (files) {
		if (files.length) {
			const copyTextFile = require('./helpers/copy-text-file');
			files.forEach(file => {
				copyTextFile(file.source, file.dist, file.onlyIfChanged);
			});
		}
		return this;
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;
