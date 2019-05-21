'use strict'

const helmet = require('helmet')

/**
 * @return {Function} Middleware.
 */
module.exports = () => {
  return helmet()
}
