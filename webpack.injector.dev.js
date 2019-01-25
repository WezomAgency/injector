'use strict';

/**
 * @fileOverview workflow example
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const injector = require('./index');

// ----------------------------------------
// Public
// ----------------------------------------

injector.app('./src/js/app.js', './dist/js/bundle-app.js')
		.publicPath('/dist/js/')
		.vendors('node_modules')
		.externals({jquery: 'jQuery'})
		.sourcemaps(injector.isProduction ? false : 'eval-source-map')
		.sass('./src/sass/style.scss', './dist/css/bundle-style.css')
		.sass('./src/sass/common.scss', './dist/css/bundle-common.css');
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
