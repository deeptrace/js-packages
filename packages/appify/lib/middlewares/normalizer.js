'use strict'

const { HttpError, InternalServerErrorHttpError } = require('@deeptrace/commons')

/**
 * @returns {Function} Middleware.
 */
module.exports = () => {
  return (err, _req, _res, next) => {
    if (err instanceof HttpError) {
      return next(err)
    }

    return next(new InternalServerErrorHttpError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      stack: err.stack
    }))
  }
}
