'use strict';

/**
 * @fileOverview exports webpack development config
 * generated by webpack-injector
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const injector = require('./index');
const fromCwd = require('from-cwd');

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Public
// ----------------------------------------

injector
	.mode('production')
	.hot(false)
	.sourcemaps(false)
	.js(fromCwd('src/js/app.js'), fromCwd('dist/js/bundle-app.js'))
	.outputPublicPath('/dist/js/')
	.sass(fromCwd('src/sass/common.scss'), fromCwd('dist/css/bundle-common.css'))
	.externals('jquery', 'jQuery');

console.log(injector.exportWebpackConfig());

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = injector.exportWebpackConfig();
