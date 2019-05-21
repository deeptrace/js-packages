'use strict'

const defaultsdeep = require('lodash.defaultsdeep')
const env = require('sugar-env')
const { format } = require('util')

/**
 * @param {Object} options Custom config options factory.
 * @param {string} environment Environment name.
 * @param {Object} logger Logger instance.
 * @returns {Object} Config object.
 */
module.exports = (options, environment, logger) => {
  const name = env.get([ 'APPIFY_APP_NAME', 'npm_package_name' ], 'app')

  return Object.freeze(defaultsdeep(options, {
    app: {
      name,
      version: env.get('GIT_RELEASE')
    },
    deeptrace: {
      dsn: env.get.url([ 'APPIFY_DEEPTRACE_DSN', 'DEEPTRACE_DSN' ]),
      timeout: env.get.int([ 'APPIFY_DEEPTRACE_TIMEOUT', 'DEEPTRACE_TIMEOUT' ], 3000),
      shouldSendCallback: () => true,
      tags: {
        environment,
        service: name,
        commit: env.get('GIT_COMMIT'),
        release: env.get('GIT_RELEASE')
      }
    },
    morgan: {
      format: env.get('APPIFY_MORGAN_FORMAT', ':method :url :status :: :response-time ms :: :res[deeptrace-id]')
    },
    sentry: {
      environment,
      attachStacktrace: true,
      dsn: env.get([ 'APPIFY_SENTRY_DSN', 'SENTRY_DSN' ]),
      tags: {
        relese: env.get('GIT_RELEASE'),
        commit: env.get('GIT_COMMIT')
      },
      beforeSend: (event) => environment !== env.DEVELOPMENT ? event : null,
      release: format('%s@%s', name, env.get('GIT_RELEASE', 'development'))
    }
  }))
}
