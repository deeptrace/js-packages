'use strict'

const nocache = require('nocache')

/**
 * @param {Object} options
 * @param {string} options.format Log format.
 * @return {Function} Middleware.
 */
module.exports = (isEnabled) => {
  if (isEnabled) {
    return nocache()
  }

  return (_req, _res, next) => { next() }
}
