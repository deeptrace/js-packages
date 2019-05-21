'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.UnprocessableEntityHttpError
 */

module.exports = class UnprocessableEntityHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 422, code, message, stack })
  }
}
