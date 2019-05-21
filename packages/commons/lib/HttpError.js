'use strict'

const InfrastructureError = require('./InfrastructureError.js')

/**
 * @module DeepTrace.JSTools.Commons.HttpError
 */

module.exports = class HttpError extends InfrastructureError {
  /**
   * @param {Object} params
   * @param {number} params.status
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ status, code, message, stack }) {
    super(message, stack)
    this.status = status
    this.code = code
  }
}
