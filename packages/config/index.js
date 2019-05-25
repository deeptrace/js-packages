'use strict'

/**
 * @module Config
 */

const config = require('./lib/config.js')
const errors = require('./lib/errors.js')
const { halt } = require('./lib/utils.js')

module.exports.halt = halt
module.exports.config = config
module.exports.ConfigError = errors.ConfigError
module.exports.ConfigValidationError = errors.ConfigValidationError




