'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const defaults = require('./defaults');
const helpers = require('./helpers');
const fromCWD = require('from-cwd');
const merge = require('lodash.merge');
const normalizePath = require('normalize-path');
const styleLoaderExcludePaths = require('./utils/style-loader-exclude-paths');
const miniCssSplitGroup = require('./utils/mini-css-split-group');

const svgSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

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
		this.__defaults.silent = on;
		logger.instance.silent = on;
		return this;
	}

	/**
	 * Specify your main single JS file.
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
	 * This option specifies the public URL of the output directory when referenced in a browser.
	 * @param {string} path
	 * @return {Injector}
	 * @see {@link https://webpack.js.org/configuration/output#outputpublicpath}
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
	external (module) {
		this.__defaults.externals.push(module);
		return this;
	}

	browserSyncOptions (options) {
		if (options) {
			this.__defaults.browserSyncOptions = options;
		}
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

	/**
	 * Specify webpack plugins for your project.
	 * Call this method for each plugin you need.
	 * @see {@link https://webpack.js.org/configuration/plugins#plugins}
	 * @param {*} plugin
	 * @returns {Injector}
	 */
	plugin (plugin) {
		if (plugin) {
			this.__defaults.plugins.push(plugin);
		}
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
	 * @param {string} sourceFiles
	 * @param {string} distFile
	 * @param {Object} spriteOptions
	 * @return {Injector}
	 */
	svgSpritemap (sourceFiles, distFile, spriteOptions) {
		this.__defaults.svgSpritemap.push({
			spriteOptions,
			sourceFile: fromCWD(sourceFiles),
			distFile: fromCWD(distFile),
			name: path.basename(distFile),
			key: `svg-${this.__defaults.svgSpritemap.length}`
		});
		return this;
	}

	/**
	 * Specify plugins for postcss-loader
	 * @see {@link https://github.com/postcss/postcss-loader}
	 * @param {*} plugin
	 * @return {Injector}
	 */
	postcssLoaderPlugin (plugin) {
		if (plugin) {
			this.__defaults.postcssLoaderPlugins.push(plugin);
		}
		return this;
	}

	/**
	 * Specify your _css-loader_ options.
	 * @see {@link https://webpack.js.org/configuration/module#rule}
	 * @param {Object} rule
	 */
	customRule (rule) {
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
	 * Specify your _css-loader_ options.
	 * @see {@link https://github.com/webpack-contrib/css-loader#options}
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
	 * Determined value - is HMR usage turn on or not
	 * @readonly
	 * @return {boolean}
	 */
	get isHot () {
		return !!this.__defaults.isHot;
	}

	/**
	 * Use this method for export generated webpack configuration
	 * @return {WebpackOptions}
	 */
	exportConfig () {
		return {
			mode: this.webpackOptionMode,
			entry: this.webpackOptionEntry,
			output: this.webpackOptionOutput,
			externals: this.webpackOptionExternals,
			devtool: this.webpackOptionDevtool,
			resolve: this.webpackOptionResolve,
			optimization: this.webpackOptionOprimization,
			stats: this.webpackOptionStats,
			module: this.webpackOptionModule,
			plugins: this.webpackOptionPlugins
		};
	}

	/**
	 * @private
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
	get webpackOptionEntry () {
		const entry = {
			[this.__defaults.app.name]: this.__defaults.app.sourceFile
		};

		this.__defaults.sass.forEach(file => {
			entry[file.name] = file.sourceFile
		});

		return entry;
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
		let plugins = [];

		if (this.__defaults.sass.length) {
			let sass = path.dirname(this.__defaults.sass[0].distFile);
			let js = path.dirname(this.__defaults.app.distFile);
			let filename = normalizePath(path.join(path.relative(js, sass), '[name].css'));
			plugins.push(new MiniCssExtractPlugin({ filename }));
		}

		this.__defaults.svgSpritemap.forEach(svgSpritemap => {
			let svg = path.dirname(svgSpritemap.distFile);
			let js = path.dirname(this.__defaults.app.distFile);
			let filename = normalizePath(path.join(path.relative(js, svg), svgSpritemap.name));
			plugins.push(new svgSpritemapPlugin(svgSpritemap.sourceFile, {
				output: {
					filename,
					chunk: {
						name: svgSpritemap.key
					}
				},
				sprite: svgSpritemap.spriteOptions
			}));
		});

		if (this.isWatching && this.__defaults.browserSyncOptions !== null) {
			if (this.isHot) {
				const self = this;
				const BrowserSyncHotPlugin = require('browser-sync-dev-hot-webpack-plugin');
				const WriteFilePlugin = require('browser-sync-dev-hot-webpack-plugin');
				plugins.push(
					new WriteFilePlugin({
						force: true,
						test: /\.(css|svg)$/,
						useHashIndex: true
					}),
					new BrowserSyncHotPlugin({
						browserSync: self.__defaults.browserSyncOptions,
						hotMiddleware: {},
						callback () {
							const updTime = new Date();
							fs.utimes(self.__defaults.app.sourceFile, updTime, updTime);
						}
					})
				);
			} else {
				const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
				plugins.push(new BrowserSyncPlugin(this.__defaults.browserSyncOptions, {
					reload: !!this.__defaults.browserSyncOptions._autoReload
				}));
			}
		}

		if (this.__defaults.silent !== true) {
			plugins.push(new WebpackBuildNotifierPlugin({
				suppressSuccess: this.isWatching ? 'initial' : false
			}));
		}

		return plugins.concat(this.__defaults.plugins);
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
		const self = this;
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
						default: {
							minChunks: 2,
							priority: -20,
							reuseExistingChunk: true
						}
					};
					self.__defaults.sass.forEach(file => {
						groups[file.key] = miniCssSplitGroup(file.name);
					});
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
				loader: 'sass-loader',
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
				}
			], (this.__defaults.sass.map(file => {
				return {
					test: file.sourceFile,
					use: [
						MiniCssExtractPlugin.loader,
						_styleLoaders.staticCSS,
						_styleLoaders.staticPostcss,
						_styleLoaders.staticSass
					]
				};
			})))
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

/**
 * @typedef {Object} WebpackInjectorSvgSpriteSource
 * @property {string} [sourceFile]
 * @property {string} [distFile]
 * @property {string} [name]
 * @property {string} [key]
 * @property {Object} [spriteOptions]
 */
