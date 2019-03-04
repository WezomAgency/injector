'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Public
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
		require('./clear')(paths);
	},

	/**
	 * Copy file from `sourceFile` to `distFile`.
	 * This can be useful when need to copy files from directories
	 * that are not included in the main distribution of the project or repository.
	 * @param {string} sourceFile
	 * @param {string} distFile
	 * @param {boolean} [onlyNewer]
	 */
	copy (sourceFile, distFile, onlyNewer) {
		require('./copy')(sourceFile, distFile, onlyNewer);
	},

	/**
	 * Local folder name
	 * @param {string[]} ignoreParentFolder
	 * @returns {string}
	 */
	getLocalFolderName (ignoreParentFolder) {
		return require('./local-folder-name')(ignoreParentFolder);
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = helpers;
