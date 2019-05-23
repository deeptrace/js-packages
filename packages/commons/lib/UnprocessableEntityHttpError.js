'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

module.exports = class UnprocessableEntityHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   * @param {Object[]} [params.details]
   */
  constructor ({ code, message, stack, details = [] }) {
    super({ status: 422, code, message, stack })
    this.details = details
  }
}
