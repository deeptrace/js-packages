'use strict'

const debug = require('debug')('appify:server')
const serverConfigFactory = require('./server-config-factory.js')
const spdy = require('spdy')

/**
 * @param {Object} options Custom config options.
 * @returns {Object} Spdy options.
 */
const spdyoptions = ({ spdy: { key, cert, ...spdy } }) => {
  return { key, cert, spdy }
}

/**
 * @param {Object} config Config object.
 * @returns {string} Socket binding info.
 */
const socketbindinfo = (config) => {
  return `pipe ${config.binding.socket}`
}

/**
 * @param {Object} config Config object.
 * @returns {string} HTTP bind info.
 */
const httpbindinfo = (config) => {
  return `http://${config.binding.ip}:${config.binding.port}/`
}

/**
 * @param {Object} logger Logger object.
 * @returns {Function} Curry'ed onListening handler function.
 */
const onListening = (logger, bind) => {
  return (err) => {
    if (err) {
      logger.error(err)
      process.exit(1)
    }

    debug(`listening on ${bind}`)
  }
}

/**
 * @param {Function<Express>} appFactory Express app factory.
 * @param {Object} configFactory Custom config options.
 * @param {string} environment Environment name.
 * @param {Object} [logger] Logger object.
 * @returns {Promise<import('spdy').Server>} Running stance of spdy server.
 */
module.exports = async (appFactory, configFactory, environment, logger = console) => {
  const config = configFactory(environment)
  const serverConfig = serverConfigFactory(config)

  return appFactory({ config, environment, logger }).then((app) => {
    const server = spdy.createServer(spdyoptions(serverConfig), app)

    if (serverConfig.binding.socket) {
      return server.listen(
        serverConfig.binding.socket,
        onListening(logger, socketbindinfo(serverConfig))
      )
    }

    return server.listen(
      serverConfig.binding.port,
      serverConfig.binding.ip,
      onListening(logger, httpbindinfo(serverConfig))
    )
  })
}
