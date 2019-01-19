'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.1.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const chalk = require('chalk');

// ----------------------------------------
// Private
// ----------------------------------------

class Logger {
	constructor () {
		/**
		 * @type {boolean}
		 * @private
		 */
		this.__silent = false;

		/**
		 * @type {boolean}
		 * @private
		 */
		this.__force = false;
	}

	/**
	 * @param {string|boolean|null} color
	 * @param {...string} message
	 */
	print (color, ...message) {
		if (this.__silent && this.__force === false) {
			return undefined;
		}
		if (color === false || color === null) {
			return console.log(message.join('\n'));
		}
		console.log(chalk[color](message.join('\n')));
	}

	blank () {
		console.log('');
	}

	line () {
		this.print('white', `-------------------------------------`);
	}

	/**
	 * @param {boolean} value
	 * @private
	 */
	set silent (value) {
		this.__silent = !!value;
	}

	/**
	 * @return {boolean}
	 */
	get silent () {
		return this.__silent;
	}

	/**
	 * @return {Logger}
	 */
	get force () {
		this.__force = true;
		return this;
	}
}

/**
 * @type {null|Logger}
 * @protected
 */
let instance = null;

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @type {logger}
 * @public
 */
let logger = {
	/**
	 * @return {Logger}
	 */
	get instance () {
		if (!(instance instanceof Logger)) {
			instance = new Logger();
		}
		instance.__force = false;
		return instance;
	},

	/**
	 * @param {string|boolean|null} color
	 * @param {...string} message
	 */
	color (color, ...message) {
		return chalk[color](...message);
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = logger;
