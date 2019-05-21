'use strict'

const appConfigFactory = require('./app-config-factory.js')
const debug = require('debug')('appify:factory')
const express = require('express')
const middlewares = require('./middlewares.js')
const Sentry = require('@sentry/node')
const unhandledRejectionTrap = require('./unhandled-rejection-trap.js')

/**
 * @typedef {Object} Logger
 * @property {Function} error
 * @property {Function} log
 */

/**
 * @typedef {Object} AppFactoryCallbackParams
 * @property {express.Router} router
 * @property {Object} config
 * @property {Logger} logger
 */

/**
 * @param {(params: AppFactoryCallbackParams) => Promise<void>} fn Custom app factory.
 * @return {Function} Express app factory.
 */
module.exports = function factory (fn) {
  /**
   * @param {Object} options
   * @param {Object<string, string|number|Object>} options.config Custom configs object.
   * @param {string} options.environment Current environment name.
   * @param {Object<string, Function>} options.logger Logger instance.
   * @returns {Express} Instance of express app.
   */
  return async function appify ({ config: customConfig, environment, logger = console }) {
    const app = express()
    const config = appConfigFactory(customConfig, environment, logger)
    const router = express.Router()

    unhandledRejectionTrap(environment, logger)

    // if (!config.deeptrace.dsn) {
    //   debug('missing deeptrace urn, traces won\'t be reported')
    // }

    config.sentry.dsn
      ? Sentry.init({ ...config.sentry })
      : debug('missing sentry dsn, its initialization has been skipped')

    // app.use(middlewares.deeptrace(config.deeptrace))
    app.use(middlewares.sentry.requests())
    app.use(middlewares.sentry.scope())
    app.use(middlewares.morgan(config.morgan))
    app.use(middlewares.parsers.urlencoded())
    app.use(middlewares.parsers.json())
    app.use(middlewares.helmet())

    await Promise.resolve(fn({ router, config, environment, logger }))

    app.use(router)

    app.get('/ping', (req, res) => {
      res
        .type('txt')
        .end('pong!')
    })

    app.use('*', middlewares.unmatched())
    app.use(middlewares.sentry.errors())
    app.use(middlewares.stderr(logger))
    app.use(middlewares.normalizer())
    app.use(middlewares.renderer(environment))

    return app
  }
}
