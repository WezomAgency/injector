'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string[]} ignoreParentFolder
 * @return {string}
 */
function localFolder (ignoreParentFolder = []) {
	/**
	 * @param {Array} arr
	 * @private
	 */
	const _getFolder = (arr = path.normalize(process.cwd()).split(path.sep)) => {
		localFolderName = arr.pop();
		if (~ignoreParentFolder.indexOf(localFolderName)) {
			_getFolder(arr);
		}
	};

	let localFolderName = '';
	_getFolder();
	return localFolderName;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = localFolder;
