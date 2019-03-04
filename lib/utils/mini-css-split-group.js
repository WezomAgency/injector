'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @param {Object} module
 * @return {string|boolean}
 */
function _miniCssRecursiveIssuer (module) {
	if (module.issuer) {
		return _miniCssRecursiveIssuer(module.issuer);
	} else if (module.name) {
		return module.name;
	} else {
		return false;
	}
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {string} groupName
 * @param {string} [chunks="all"]
 * @return {Object}
 */
function miniCssSplitGroup (groupName, chunks = 'all') {
	return {
		name: groupName,
		test: (m, c, entry = groupName) => {
			return m.constructor.name === 'CssModule' && _miniCssRecursiveIssuer(m) === entry;
		},
		chunks: chunks,
		enforce: true
	};
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = miniCssSplitGroup;
