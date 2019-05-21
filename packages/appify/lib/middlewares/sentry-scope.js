'use strict'

const Sentry = require('@sentry/node')

/**
 * @return {Function} Middleware.
 */
module.exports = () => (req, res, next) => {
  Sentry.withScope((scope) => {
    // scope.setTag('deeptrace_id', req.deeptrace.id)
    // scope.setTag('deeptrace_parent_id', req.deeptrace.parentid)
    // scope.setTag('deeptrace_root_id', req.deeptrace.rootid)

    next()
  })
}
