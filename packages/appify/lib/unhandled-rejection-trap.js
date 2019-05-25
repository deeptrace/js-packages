'use strict'

const { environments } = require('@deeptrace/commons')
const Sentry = require('@sentry/node')

/**
 * @param {string} environment
 * @param {Object<string, Function>} logger
 * @returns {void}
 */
module.exports = function onUnhandledRejectionTrap (environment, logger) {
  if (environment === environments.TEST) {
    return
  }

  process.on('unhandledRejection', (err) => {
    logger.error(err)

    const client = Sentry
      .getCurrentHub()
      .getClient()

    if (!client) {
      process.exit(1)
    }

    Sentry.captureException(err)

    client
      .close(3000)
      .then(() => { process.exit(1) })
  })
}
