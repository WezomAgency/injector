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
	 * Copy file from `sourceFile` to `destFile`.
	 * This can be useful when need to copy files from directories
	 * that are not included in the main distribution of the project or repository.
	 * @param {string} sourceFile
	 * @param {string} destFile
	 * @param {boolean} [onlyNewer]
	 */
	copy (sourceFile, destFile, onlyNewer) {
		const copy = require('./helpers/copy');
		copy(sourceFile, destFile, onlyNewer);
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
