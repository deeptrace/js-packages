'use strict'

const { HttpError } = require('@deeptrace/commons')

/**
 * @param {Object} logger Instance of logger.
 * @returns {Function} Middleware.
 */
module.exports = (logger) => {
  return (err, _req, _res, next) => {
    if (!(err instanceof HttpError)) {
      logger.error(err)
    }

    return next(err)
  }
}
