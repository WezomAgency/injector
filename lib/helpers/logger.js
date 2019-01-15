'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.1.0
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

const chalk = require('chalk');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Вывод цветных логов
 * @param {string|boolean|null} color
 * @param {...string} message
 */
function logger (color, ...message) {
	if (color === false || color === null) {
		return console.log(message.join('\n'));
	}
	console.log(chalk[color](message.join('\n')));
}

/**
 * Пустая строка
 * @method
 */
logger.blank = function () {
	console.log('');
};

/**
 * Разделительная полоса
 * @method
 */
logger.line = function () {
	this('white', `-------------------------------------`);
};

/**
 * @param {string|boolean|null} color
 * @param {...string} message
 */
logger.color = function (color, ...message) {
	return chalk[color](...message);
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = logger;
