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

	/**
	 * Exports generated webpack.config from Injector instance
	 * @return {WebpackOptions}
	 */
	exportWebpackConfig () {
		const instance = this;

		/** @type {WebpackOptions} */
		let config = {
			mode: this._settings.mode,
			devtool: this._settings.sourcemaps,
			externals: this._settings.externals,
			get entry () {
				if (instance._settings.js === null) {
					return;
				}
				const entry = {
					[instance._settings.js.name]: instance._settings.js.source
				};
				instance._settings.sass.forEach(file => {
					entry[file.name] = file.source;
				});
				return entry;
			},
			output: {
				filename (file) {
					if (/\.(s)?css$/.test(file.chunk.entryModule.resource)) {
						return '_webpack-injector-temp/[name].js';
					}
					return '[name].js';
				},
				path: instance._settings.outputPath,
				publicPath: instance._settings.outputPublicPath,
				chunkFilename: '_async-chunks/[name].js?=[chunkhash]'
			},
			stats: {
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
			}
		};

		return Object.assign({}, config, this._custom);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;

// ----------------------------------------
// Definitions
// ----------------------------------------
