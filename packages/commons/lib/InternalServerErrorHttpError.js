'use strict'

const ServerFaultHttpError = require('./ServerFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.InternalServerErrorHttpError
 */

module.exports = class InternalServerErrorHttpError extends ServerFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 500, code, message, stack })
  }
}
