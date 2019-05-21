'use strict'

const Sentry = require('@sentry/node')

/**
 * @return {Function} Middleware.
 */
module.exports = () => {
  return (req, res, next) => {
    return Sentry.Handlers.requestHandler()(req, res, next)
  }
}
