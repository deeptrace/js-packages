'use strict'

const Sentry = require('@sentry/node')
const { UserFaultHttpError } = require('@deeptrace/commons')

/**
 * @return {Function} Middleware.
 */
module.exports = () => {
  return (err, req, res, next) => {
    if (err instanceof UserFaultHttpError) {
      return next(err)
    }

    return Sentry.Handlers.errorHandler()(err, req, res, next)
  }
}
