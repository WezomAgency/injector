'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Public
// ----------------------------------------

class Injector {
	constructor () {
		/**
		 * @private
		 * @type {WebpackOptions}
		 */
		this.config = {
			mode: 'production'
		};
	}

	/**
	 * Setting wepback.config option `mode`
	 * @param {string} value - production / development / none
	 * @return {Injector}
	 */
	mode (value) {
		if (~['production', 'development'].indexOf(value)) {
			this.config.mode = value;
		}
		return this;
	}

	/**
	 * Exports generated webpack.config from Injector instance
	 * @return {WebpackOptions}
	 */
	exportWebpackConfig () {
		return Object.assign({}, this.config);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = Injector;

// ----------------------------------------
// Definitions
// ----------------------------------------
