'use strict';

/**
 * @fileOverview exports Injector instance
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @licence MIT
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const Injector = require('./lib/Injector');

// ----------------------------------------
// Public
// ----------------------------------------

const injector = new Injector();

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = injector;
