'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const logger = require('../utils/logger');
const normalizePath = require('normalize-path');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} sourceFile
 * @param {string} destFile
 * @param {boolean} [onlyNewer]
 */
function copy (sourceFile, destFile, onlyNewer) {
	sourceFile = normalizePath(sourceFile);
	destFile = normalizePath(destFile);
	const sourceStats = fs.statSync(sourceFile);
	if (!sourceStats.isFile() || sourceStats.isSymbolicLink()) {
		logger.instance.force.line();
		logger.instance.force.print('red', 'Error `sourceFile` must be a File!');
		logger.instance.force.line();
		process.exit(0);
	}

	const dirname = path.dirname(destFile);
	if (!fs.existsSync(dirname)) {
		mkdirp.sync(dirname);
	}

	if (onlyNewer) {
		const distStats = fs.existsSync(destFile) ? fs.statSync(destFile) : {mtimeMs: 0};
		if (sourceStats.mtimeMs <= distStats.mtimeMs) {
			logger.instance.print('white', `source file    ${logger.instance.color('blue', sourceFile)}`);
			logger.instance.print('white', `not newer than ${logger.instance.color('blue', destFile)}`);
			logger.instance.print('white', 'skip copying');
			logger.instance.line();
			return;
		}
	}
	fs.copyFileSync(sourceFile, destFile);
	logger.instance.print('white', `copied ${logger.instance.color('blue', sourceFile)}`);
	logger.instance.print('white', `to     ${logger.instance.color('blue', destFile)}`);
	logger.instance.line();
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = copy;
