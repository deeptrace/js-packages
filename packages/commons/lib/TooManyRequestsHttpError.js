'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

module.exports = class TooManyRequestsHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 429, code, message, stack })
  }
}
