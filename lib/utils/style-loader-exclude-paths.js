'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string[]} list - exclude all, except this list
 * @return {RegExp}
 */
function styleLoaderExcludePaths (list) {
	let pattern = list.join('|');
	pattern = pattern.replace(/\\/g, '\\\\');
	pattern = pattern.replace(/\//g, '\\/');
	pattern = pattern.replace(/\./g, '\\.');
	return new RegExp(`(${pattern})`, 'i');
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = styleLoaderExcludePaths;
