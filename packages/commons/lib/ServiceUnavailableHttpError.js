'use strict'

const ServerFaultHttpError = require('./ServerFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.ServiceUnavailableHttpError
 */

module.exports = class ServiceUnavailableHttpError extends ServerFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 503, code, message, stack })
  }
}
