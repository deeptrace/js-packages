'use strict'

const defaultsdeep = require('lodash.defaultsdeep')
const { config, halt } = require('@deeptrace/config')

/**
 * @param {Object} options Custom config options factory.
 * @returns {Object} Config object.
 */
module.exports = halt(({ server = { } }) => {
  return Object.freeze(defaultsdeep(server, config(({ env, is, as }) => ({
    binding: {
      socket: env('APPIFY_SERVER_BINDING_SOCKET'),
      ip: env('APPIFY_SERVER_BINDING_IP', [ is.defaultTo('0.0.0.0') ]),
      port: env('APPIFY_SERVER_BINDING_PORT', [ is.defaultTo('3000'), as.integer() ])
    },
    spdy: {
      protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
      'x-forwarded-for': env('APPIFY_SERVER_SPDY_X_FORWARDED_FOR', [ is.defaultTo('true'), as.boolean() ]),
      plain: env('APPIFY_SERVER_SPDY_PLAIN', [ is.defaultTo('true'), as.boolean() ])
    }
  }))))
})
