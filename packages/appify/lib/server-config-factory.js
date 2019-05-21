'use strict'

const defaultsdeep = require('lodash.defaultsdeep')
const env = require('sugar-env')

/**
 * @param {Object} options Custom config options factory.
 * @returns {Object} Config object.
 */
module.exports = ({ server = { } }) => {
  return Object.freeze(defaultsdeep(server, {
    binding: {
      socket: env.get('APPIFY_SERVER_BINDING_SOCKET'),
      ip: env.get('APPIFY_SERVER_BINDING_IP', '0.0.0.0'),
      port: env.get.int('APPIFY_SERVER_BINDING_PORT', 3000)
    },
    spdy: {
      protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
      'x-forwarded-for': env.get.boolean('APPIFY_SERVER_SPDY_X_FORWARDED_FOR', true),
      plain: env.get.boolean('APPIFY_SERVER_SPDY_PLAIN', true),
      ssl: env.get.boolean('APPIFY_SERVER_SPDY_SSL', false),
      key: env.get.base64('APPIFY_SERVER_SSL_KEY', undefined),
      cert: env.get.base64('APPIFY_SERVER_SSL_CERT', undefined)
    }
  }))
}
