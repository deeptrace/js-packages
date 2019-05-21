'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.UnauthorizedHttpError
 */

module.exports = class UnauthorizedHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 401, code, message, stack })
  }
}
