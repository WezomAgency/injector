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

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const logger = require('./logger');
const normalizePath = require('normalize-path');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Копирование одного текстового файла
 * Актуально для извлечения файлов из директории node_modules и прочее
 * @param {string} sourceFile
 * @param {string} distFile
 * @param {boolean} [onlyIfChanged=true]
 */
function copyTextFile (sourceFile, distFile, onlyIfChanged = true) {
	sourceFile = normalizePath(sourceFile);
	distFile = normalizePath(distFile);
	const dirname = path.dirname(distFile);
	const content = fs.readFileSync(sourceFile).toString();

	if (!fs.existsSync(dirname)) {
		mkdirp.sync(dirname);
	}

	if (onlyIfChanged) {
		const distContent = fs.existsSync(distFile) ? fs.readFileSync(distFile).toString() : '';
		if (content === distContent) {
			logger('white', `source file ${logger.color('blue', sourceFile)}`);
			logger('white', `same as     ${logger.color('blue', distFile)}`);
			logger('white', 'skip copying');
			logger.line();
			return;
		}
	}
	fs.writeFileSync(distFile, content);
	logger('white', `copied ${logger.color('blue', sourceFile)}`);
	logger('white', `to     ${logger.color('blue', distFile)}`);
	logger.line();
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = copyTextFile;
