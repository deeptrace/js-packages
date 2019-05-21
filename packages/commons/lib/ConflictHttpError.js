'use strict'

const UserFaultHttpError = require('./UserFaultHttpError.js')

/**
 * @module DeepTrace.JSTools.Commons.ConflictHttpError
 */

module.exports = class ConflictHttpError extends UserFaultHttpError {
  /**
   * @param {Object} params
   * @param {string} params.code
   * @param {string} params.message
   * @param {string} [params.stack]
   */
  constructor ({ code, message, stack }) {
    super({ status: 409, code, message, stack })
  }
}
