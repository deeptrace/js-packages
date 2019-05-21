'use strict'

const debug = require('debug')('appify:request')
const morgan = require('morgan')

/**
 * @param {Object} options
 * @param {string} options.format Log format.
 * @return {Function} Middleware.
 */
module.exports = ({ format }) => {
  const stream = {
    write: (string) => { debug(string.replace(/\n/, '')) }
  }

  return morgan(format, { stream })
}
