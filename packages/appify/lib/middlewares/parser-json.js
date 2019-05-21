'use strict'

const { json } = require('body-parser')

/**
 * @return {Function} Middleware.
 */
module.exports = () => {
  return json()
}
