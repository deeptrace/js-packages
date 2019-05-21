'use strict'

const { urlencoded } = require('body-parser')

/**
 * @return {Function} Middleware.
 */
module.exports = () => {
  return urlencoded({ extended: true })
}
