'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const logger = require('./utils/logger');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @namespace
 */
const helpers = {
	/**
	 * @param {string|string[]} paths
	 */
	clear (paths) {
		const clear = require('./helpers/clear');
		clear(paths);
	},

	/**
	 * Copy file
	 * @param {string} sourceFile
	 * @param {string} distFile
	 * @param {boolean} [onlyNewer]
	 */
	copy (sourceFile, distFile, onlyNewer) {
		const copy = require('./helpers/copy');
		copy(sourceFile, distFile, onlyNewer);
	}
};

// ----------------------------------------
// Public
// ----------------------------------------

class Injector {
	constructor () {
		this.helpers = helpers;
	}

	/**
	 * Disable info logs
	 * @param {boolean} value
	 */
	silent (value) {
		logger.instance.silent = value;
		return this;
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;
