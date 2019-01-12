'use strict';

/**
 * @fileOverview exports Injector instance
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
