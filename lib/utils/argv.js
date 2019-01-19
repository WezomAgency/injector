'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const argv = require('yargs').argv;

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} value
 */
function detect (key) {
	let value = argv[key];
	if (Array.isArray(value)) {
		return value[value.length - 1];
	}
	return value;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = detect;
