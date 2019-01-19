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
const argv = require('./utils/argv');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @namespace
 */
const helpers = {
	/**
	 * Clear some folders or files,
	 * before webpack starts to bundle your project
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

/**
 * @namespace
 */
const defaults = {
	/**
	 * @type {boolean}
	 */
	isProduction: argv('production'),

	/**
	 * @type {boolean}
	 */
	isWatching: argv('watch')
};

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
	 * Disable information logs in terminal
	 * @param {boolean} value
	 */
	silent (value) {
		logger.instance.silent = value;
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
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;
