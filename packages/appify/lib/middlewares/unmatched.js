'use strict'

const { NotFoundHttpError } = require('@deeptrace/commons')

/**
 * @returns {Function} Middleware.
 */
module.exports = () => {
  return (_req, _res, next) => next(new NotFoundHttpError({
    code: 'RESOURCE_NOT_FOUND',
    message: 'It seems the requested resource does not exist.'
  }))
}
