'use strict'

const { environments } = require('@deeptrace/commons')

/**
 * @param {import('@deeptrace/commons').HttpError} err Error instance.
 * @param {string} environment Environment name.
 * @param {string} genericmessage Generic displayable error message.
 * @returns {string} Displayable error message.
 */
const getMessage = (err, environment, genericmessage) => {
  if (err.status < 500) {
    return err.message
  }

  return environment !== environments.PRODUCTION
    ? err.message
    : genericmessage
}

/**
 * @param {import('@deeptrace/commons').HttpError} err Error instance.
 * @param {string} environment Environment name.
 * @returns {string|undefined} Displayable stack.
 */
const getStack = (err, environment) => {
  return err.status >= 500 && environment !== environments.PRODUCTION
    ? err.stack
    : undefined
}

/**
 * @param {import('@deeptrace/commons').HttpError} err Error instance.
 * @param {string} environment Environment name.
 * @returns {Object[]|undefined} Displayable stack.
 */
const getDetails = (err) => {
  return err.details
    ? err.details
    : undefined
}

/**
 * @param {string} environment Current environment name.
 * @returns {Function} Middleware.
 */
module.exports = (environment) => {
  return (err, _req, res, _next) => {
    const { code, status } = err
    const stack = getStack(err, environment)
    const message = getMessage(err, environment, 'Oh no! Something went wrong on our end.')
    const details = getDetails(err)

    res
      .status(status)
      .json({ status, error: { code, message, stack, details } })
  }
}
