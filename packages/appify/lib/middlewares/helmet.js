'use strict'

const helmet = require('helmet')

/**
 * @param {Object} config
 * @return {Function} Middleware.
 */
module.exports = (config) => {
  return helmet(config)
}
