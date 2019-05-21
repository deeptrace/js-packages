'use strict'

/**
 * @module DeepTrace.JSTools.Commons.Error
 */

module.exports = class extends Error {
  /**
   * @param {string} message
   * @param {string} [stack]
   */
  constructor (message, stack) {
    super(message)
    if (stack) this.stack = stack
    this.name = this.constructor.name
  }
}
