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

injector.helpers.copy('./node_modules/jquery/dist/jquery.min.js', './public/assets/js/vendors/jquery.js', true);
injector.helpers.copy('./src/js/app.js', './dist/js/app.js', true);
injector.helpers.copy('./node_modules/webpack/readme.md', './dist/TEST.md', true);

// ----------------------------------------
// Exports
// ----------------------------------------

// module.exports = injector.exportWebpackConfig();
