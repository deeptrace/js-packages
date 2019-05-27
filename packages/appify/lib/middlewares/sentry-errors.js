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

    Sentry.withScope((scope) => {
      // scope.setTag('deeptrace_id', req.deeptrace.id)
      // scope.setTag('deeptrace_parent_id', req.deeptrace.parentid)
      // scope.setTag('deeptrace_root_id', req.deeptrace.rootid)

      Sentry.Handlers.errorHandler()(err, req, res, () => { })
    })

    if (res.sentry) {
      res.set({ 'sentry-trace': res.sentry })
    }

    next(err)
  }
}
