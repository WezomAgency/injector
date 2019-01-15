'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const normalizePath = require('normalize-path');
const fromCwd = require('from-cwd');

// ----------------------------------------
// Private
// ----------------------------------------

const _cwd = normalizePath(fromCwd('./'));

// ----------------------------------------
// Public
// ----------------------------------------

class Injector {
	constructor () {
		/** @private */
		this._custom = {};

		const instance = this;

		/** @private */
		this._settings = {
			mode: 'development',
			hot: null,
			sourcemaps: null,
			js: null,
			sass: [],
			externals: [],
			path: '',
			publicPath: '',
			modernizr: null,
			bLENME: [],
			styleLoader: {
				loader: 'style-loader',
				options: {
					get hmr () {
						return instance._settings.hot;
					},
					get sourceMap () {
						return instance._settings.sourcemaps;
					}
				}
			},
			cssLoader: {
				loader: 'css-loader',
				options: {
					get sourceMap () {
						return instance._settings.sourcemaps
					},
					importLoaders: 1
				}
			},
			postcssLoader: {
				loader: 'postcss-loader',
				options: {
					get sourceMap () {
						return instance._settings.sourcemaps;
					},
					plugins: []
				}
			}
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
		source = fromCwd(source);
		dist = fromCwd(dist);
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
		source = fromCwd(source);
		dist = fromCwd(dist);
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
	publicPath (value) {
		this._settings.publicPath = value;
		return this;
	}

	/**
	 * Setting wepback.config option `externals`
	 * @see {@link https://webpack.js.org/configuration/externals/}
	 * @param {string|function} key
	 * @param {string|string[]|Object} [value] - if `module` is string
	 * @return {Injector}
	 */
	externals (key, value) {
		if (typeof key === 'function') {
			this._settings.externals.push(key);
		} else {
			this._settings.externals.push({ [key]: value });
		}
		return this;
	}

	/**
	 * Use module `modernizr-loader`
	 * @param {string} value
	 * @return {Injector}
	 */
	modernizrrc (value) {
		this._settings.modernizr = path.relative(_cwd, normalizePath(value));
		return this;
	}

	/**
	 * Creating a regular expression for excluding node_modules
	 * from babel transpiling except for individual modules
	 * @see {@link https://github.com/WezomAgency/babel-loader-exclude-node-modules-except}
	 * @param {string} moduleName
	 * @return {Injector}
	 */
	bLENME (moduleName) {
		this._settings.bLENME.push(moduleName);
		return this;
	}

	/**
	 * Set your own, custom options for config.
	 * They will merged with options defined via injector methods
	 * @param {WebpackOptions} object
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
		/** @type {WebpackOptions} */
		let config = {
			mode: this.webpackConfigMode,
			externals: this.webpackConfigExternals,
			entry: this.webpackConfigEntry,
			output: this.webpackConfigOutput,
			module: this.webpackConfigModule,
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
			path: this._settings.path,
			publicPath: this._settings.publicPath,
			chunkFilename: '_async-chunks/[name].js?=[chunkhash]'
		};
	}

	/**
	 * @private
	 * @return {WebpackOptions.module}
	 */
	get webpackConfigModule () {
		const module = {
			rules: []
		};

		if (this._settings.modernizr) {
			let modernizr = this._settings.modernizr.replace(/\./g, '\\.');
			module.rules.push({
				test: new RegExp(modernizr + '$'),
				loader: 'modernizr-loader!json5-loader'
			});
		}

		if (this._settings.bLENME.length) {
			const bLENME = require('babel-loader-exclude-node-modules-except');
			module.rules.push({
				test: /\.js$/,
				exclude: bLENME(this._settings.bLENME),
				use: {
					loader: 'babel-loader'
				}
			})
		}

		module.rules.push({
			test: /\.css$/,
			use: [
				this._settings.styleLoader,
				this._settings.cssLoader,
				this._settings.postcssLoader
			]
		});

		this._settings.sass.forEach(file => {
			module.rules.push({
				test: file.source,
				use: [
					this._settings.styleLoade,
					this._settings.cssLoader,
					this._settings.postcssLoader
				]
			})
		});

		return module;
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
