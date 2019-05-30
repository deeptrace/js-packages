'use strict'

const { config, halt } = require('@deeptrace/config')
const defaultsdeep = require('lodash.defaultsdeep')
const { format } = require('util')

/**
 * @param {Object} options Custom config options factory.
 * @param {string} environment Environment name.
 * @returns {Object} Config object.
 */
module.exports = halt((options, environment) => {
  return Object.freeze(defaultsdeep(options, config(({ env, is, as }) => {
    const name = env([ 'APPIFY_APP_NAME', 'npm_package_name' ], [ is.defaultTo('app') ])

    return {
      app: {
        name,
        version: env('GIT_RELEASE'),
        commit: env('GIT_COMMIT')
      },
      deeptrace: {
        dsn: env([ 'APPIFY_DEEPTRACE_DSN', 'DEEPTRACE_DSN' ], [ is.url() ]),
        tags: {
          environment,
          service: name,
          commit: env('GIT_COMMIT'),
          release: env('GIT_RELEASE')
        },
        beforeSend: (trace) => trace,
      },
      helmet: {
        noCache: true
      },
      morgan: {
        format: env('APPIFY_MORGAN_FORMAT', [ is.defaultTo(':method :url :status :: :response-time ms :: :res[deeptrace-id]') ])
      },
      sentry: {
        environment,
        attachStacktrace: true,
        dsn: env([ 'APPIFY_SENTRY_DSN', 'SENTRY_DSN' ]),
        tags: {
          relese: env('GIT_RELEASE'),
          commit: env('GIT_COMMIT')
        },
        beforeSend: (event) => environment !== env.DEVELOPMENT ? event : null,
        release: format('%s@%s', name, env('GIT_RELEASE', [ is.defaultTo('development') ]))
      }
    }
  })))
})
