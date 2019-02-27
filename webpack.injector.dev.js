'use strict';

/**
 * @fileOverview workflow example
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const injector = require('./index');
const autoprefixer = require('autoprefixer');
const cssMqPacker = require('css-mqpacker');
const sortCssMediaQueries = require('sort-css-media-queries');

// ----------------------------------------
// Public
// ----------------------------------------

injector.app('./src/js/app.js', './dist/js/bundle-app.js')
		.publicPath('/dist/js/')
		.vendors('node_modules')
		.externals({jquery: 'jQuery'})
		.sourcemaps(injector.isProduction ? false : 'eval-source-map')
		.sass('./src/sass/style.scss', './dist/css/bundle-style.css')
		.sass('./src/sass/common.scss', './dist/css/bundle-common.css')
		.cssLoaderOptions({
			url: false
		})
		.postcssLoaderPlugins(autoprefixer({
			browsers: ['> 1%', 'ie 11'],
			cascade: false
		}))
		.postcssLoaderPlugins(cssMqPacker({
			sort: sortCssMediaQueries
		}))
		.postcssLoaderPlugins(injector.isProduction ? require('cssnano')({
			preset: ['default', {
				zindex: false,
				autoprefixer: false,
				reduceIdents: false,
				discardUnused: false,
				cssDeclarationSorter: false, // disable plugin
				postcssCalc: false, // disable plugin
				discardComments: { // custom plugin config
					removeAll: true
				}
			}]
		}) : null);
injector.helpers.copy('./node_modules/jquery/dist/jquery.min.js', './public/assets/js/vendors/jquery.js', true);
injector.helpers.copy('./src/js/app.js', './dist/js/app.js', true);
injector.helpers.copy('./node_modules/webpack/readme.md', './dist/TEST.md', true);



console.log(injector.__defaults);
console.log('--------------');
console.log(injector.exportConfig());

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = injector.exportConfig();
