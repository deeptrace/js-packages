'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.GoneHttpError
 */

module.exports = class GoneHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 410, code, message, stack })
  }
}
