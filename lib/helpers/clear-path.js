'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 2.0.0
 */

// ----------------------------------------
// Definitions
// ----------------------------------------

/**
 * @method require
 * @global
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const del = require('del');
const logger = require('./logger');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Удаление указанного пути
 * @param {string[]} paths
 */
function clearPath (paths) {
	logger.line();
	logger('white', 'Clear path:');
	paths.forEach(path => {
		logger('blue', path);
		del.sync(path);
	});
	logger('yellow', 'DONE!');
	logger.blank();
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = clearPath;
