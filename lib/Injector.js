'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const logger = require('./utils/logger');
const defaults = require('./defaults');
const helpers = require('./helpers');
const fromCWD = require('from-cwd');
const merge = require('lodash.merge');
const styleLoaderExcludePaths = require('./utils/style-loader-exclude-paths');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BrowserSyncHotPlugin = require('browser-sync-dev-hot-webpack-plugin');

// ----------------------------------------
// Public
// ----------------------------------------

class Injector {
	constructor () {
		/** @private */
		this.__defaults = defaults;
		this.helpers = helpers;
	}

	/**
	 * Enable/disable information logs in terminal
	 * @param {boolean} on
	 */
	silent (on) {
		logger.instance.silent = on;
		return this;
	}

	/**
	 * @param {string} sourceFile
	 * @param {string} distFile
	 * @return {Injector}
	 */
	app (sourceFile, distFile) {
		this.__defaults.app = {
			sourceFile: fromCWD(sourceFile),
			distFile: fromCWD(distFile),
			name: path.basename(distFile, '.js')
		};
		return this;
	}

	/**
	 * @param {string|string[]|RegExp|RegExp[]} sample
	 * @return {Injector}
	 */
	vendors (sample) {
		if (Array.isArray(sample)) {
			sample.forEach(item => this.__defaults.vendors.push(item));
		} else {
			this.__defaults.vendors.push(sample);
		}
		return this;
	}

	/**
	 * @param {string} path
	 * @return {Injector}
	 */
	publicPath (path) {
		this.__defaults.publicPath = path;
		return this;
	}

	/**
	 * Setting wepback.config option `externals`
	 * @see {@link https://webpack.js.org/configuration/externals/}
	 * @param {string|function|Object|RegExp} module
	 * @return {Injector}
	 */
	externals (module) {
		this.__defaults.externals.push(module);
		return this;
	}

	/**
	 * @see {@link https://webpack.js.org/configuration/devtool/}
	 * @param {string|boolean} value
	 * @return {Injector}
	 */
	sourcemaps (value) {
		this.__defaults.sourcemaps = value;
		return this;
	}

	/**
	 * @see {@link https://webpack.js.org/configuration/resolve/#resolve-alias}
	 * @param {string} alias
	 * @param {string} path
	 * @return {Injector}
	 */
	resolveAlias (alias, path) {
		this.__defaults.resolveAlias[alias] = fromCWD(path);
		return this;
	}

	/**
	 * @see {@link https://webpack.js.org/configuration/resolve/#resolve-modules}
	 * @param {string} path
	 * @return {Injector}
	 */
	resolveModules (path) {
		this.__defaults.resolveModules.push(fromCWD(path));
		return this;
	}

	plugins (plugin) {
		if (
			plugin instanceof BrowserSyncPlugin ||
			plugin instanceof BrowserSyncHotPlugin
		) {
			logger.instance.line();
			logger.instance.print('white', `"browser-sync-webpack-plugin" and "browser-sync-dev-hot-webpack-plugin"!`);
			logger.instance.print('white', `already underhood`);
			return this;
		}
		this.__defaults.plugins.push(plugin);
		return this;
	}

	/**
	 * @param {string} sourceFile
	 * @param {string} distFile
	 * @return {Injector}
	 */
	sass (sourceFile, distFile) {
		this.__defaults.sass.push({
			sourceFile: fromCWD(sourceFile),
			distFile: fromCWD(distFile),
			name: path.basename(distFile, '.css'),
			key: `sass-${this.__defaults.sass.length}`
		});
		return this;
	}

	/**
	 * @param {*} plugin
	 * @return {Injector}
	 */
	postcssLoaderPlugins (plugin) {
		if (plugin) {
			this.__defaults.postcssLoaderPlugins.push(plugin);
		}
		return this;
	}

	/**
	 * @param {Object} rule
	 */
	customRules (rule) {
		if (rule) {
			this.__defaults.customRules.push(rule);
		}
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {Injector}
	 */
	styleLoaderOptions (options) {
		if (options) {
			this.__defaults.styleLoaderOptions.push(options);
		}
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {Injector}
	 */
	sassLoaderOptions (options) {
		if (options) {
			this.__defaults.sassLoaderOptions.push(options);
		}
		return this;
	}

	/**
	 * @param {Object} options
	 * @return {Injector}
	 */
	cssLoaderOptions (options) {
		if (options) {
			this.__defaults.cssLoaderOptions.push(options);
		}
		return this;
	}

	/**
	 * Determined value - is webpack will be runned in production mode or development mode
	 * @readonly
	 * @return {boolean}
	 */
	get isProduction () {
		return !!this.__defaults.isProduction;
	}

	/**
	 * Determined value - is webpack will be watching files or not
	 * @readonly
	 * @return {boolean}
	 */
	get isWatching () {
		return !!this.__defaults.isWatching;
	}

	/**
	 * @return {WebpackOptions}
	 */
	exportConfig () {
		return {
			mode: this.webpackOptionMode,
			output: this.webpackOptionOutput,
			externals: this.webpackOptionExternals,
			devtool: this.webpackOptionDevtool,
			plugins: this.webpackOptionPlugins,
			resolve: this.webpackOptionResolve,
			optimization: this.webpackOptionOprimization,
			stats: this.webpackOptionStats,
			module: this.webpackOptionModule
		};
	}

	/**
	 * @return {string}
	 * @private
	 */
	get webpackOptionMode () {
		return this.isProduction ? 'production' : 'development';
	}

	/**
	 * @return {Object}
	 * @private
	 */
	get webpackOptionOutput () {
		return {
			path: path.dirname(this.__defaults.app.distFile),
			publicPath: this.__defaults.publicPath,
			chunkFilename: '_webpack-injector-chunks/[name].js?chunk=[chunkhash]',
			filename (file) {
				if (/\.(s)?css$/.test(file.chunk.entryModule.resource)) {
					return '_webpack-injector-temp/[name].js';
				}
				return '[name].js';
			}
		};
	}

	/**
	 * @return {Array}
	 * @private
	 */
	get webpackOptionExternals () {
		return this.__defaults.externals;
	}

	/**
	 * @return {string|boolean}
	 * @private
	 */
	get webpackOptionDevtool () {
		return this.__defaults.sourcemaps;
	}

	/**
	 * @return {Array}
	 * @private
	 */
	get webpackOptionPlugins () {
		return this.__defaults.plugins;
	}

	/**
	 * @private
	 * @return {Object}
	 */
	get webpackOptionResolve () {
		return {
			alias: this.__defaults.resolveAlias,
			modules: this.__defaults.resolveModules
		};
	}

	/**
	 * @private
	 * @return {Object}
	 */
	get webpackOptionOprimization () {
		return {
			noEmitOnErrors: true,
			splitChunks: {
				chunks: 'async',
				minSize: 300.001,
				minChunks: 1,
				maxAsyncRequests: 5,
				maxInitialRequests: 3,
				automaticNameDelimiter: '~',
				name: true,
				get cacheGroups () {
					const groups = {
						vendors: {
							test: /[\\/](node_modules|_vendors)[\\/]/,
							priority: -10
						},
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true
						}
					};

					// PATHS.bundleSassFiles.forEach(file => {
					// 	groups[file.keyword] = miniCssSplitGroup(file.bundleName);
					// });

					return groups;
				}
			}
		};
	}

	/**
	 * @private
	 * @return {Object}
	 */
	get webpackOptionStats () {
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
	 * @return {Object}
	 */
	get webpackOptionModule () {
		const _hotSourceMap = loader => {
			let _default = {};
			if (loader.options.sourceMap) {
				_default = {
					options: {
						sourceMap: this.__defaults.isHot
					}
				};
			}
			return merge(_default, loader);
		};

		const _styleLoaders = {
			staticStyle: {
				loader: 'css-loader',
				options: merge(...this.__defaults.styleLoaderOptions)
			},
			get hotStyle () {
				return _hotSourceMap(this.staticStyle);
			},

			staticCSS: {
				loader: 'css-loader',
				options: merge(...this.__defaults.cssLoaderOptions)
			},
			get hotCSS () {
				return _hotSourceMap(this.staticCSS);
			},

			staticPostcss: {
				loader: 'postcss-loader',
				options: {
					sourceMap: !!this.__defaults.sourcemaps,
					plugins: this.__defaults.postcssLoaderPlugins
				}
			},
			get hotPostcss () {
				return _hotSourceMap(this.staticPostcss);
			},

			staticSass: {
				loader: 'postcss-loader',
				options: {
					sourceMap: !!this.__defaults.sourcemaps,
					options: merge(...this.__defaults.sassLoaderOptions)
				}
			},
			get hotSass () {
				return _hotSourceMap(this.staticSass);
			}
		};

		return {
			rules: this.__defaults.customRules.concat([
				{
					test: /\.modernizrrc$/,
					loader: 'modernizr-loader!json5-loader'
				}, {
					test: /\.css$/,
					use: [
						_styleLoaders.hotStyle,
						_styleLoaders.hotCSS,
						_styleLoaders.hotPostcss
					]
				}, {
					test: /\.css$/,
					exclude: styleLoaderExcludePaths(this.__defaults.sass.map(file => file.sourceFile)),
					use: [
						_styleLoaders.hotStyle,
						_styleLoaders.hotCSS,
						_styleLoaders.hotPostcss,
						_styleLoaders.hotSass
					]
				}/* , (this.__defaults.sass.map(file => {
					return {
						test: file.sourceFile,
						use: [
							Mni
						]
					}
				})) */
			])
		};
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;

// ----------------------------------------
// Definitions
// ----------------------------------------

/**
 * @typedef {Object} WebpackInjectorSource
 * @property {string} [sourceFile]
 * @property {string} [distFile]
 * @property {string} [name]
 * @property {string} [key]
 * @property {Object} [options]
 */
