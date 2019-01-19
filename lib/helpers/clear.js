'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const del = require('del');
const logger = require('../utils/logger');

// ----------------------------------------
// Publics
// ----------------------------------------

/**
 * @param {string|string[]} paths
 */
function clear (paths) {
	if (!Array.isArray(paths)) {
		paths = [paths];
	}

	logger.instance.line();
	logger.instance.print('white', 'Clear path:');

	paths.forEach(path => {
		logger.instance.print('blue', path);
		del.sync(path);
	});

	logger.instance.print('yellow', 'DONE!');
	logger.instance.blank();
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = clear;
