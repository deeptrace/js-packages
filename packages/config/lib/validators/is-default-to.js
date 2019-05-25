'use strict'

const { isEmpty } = require('../utils.js')

/**
 * Replaces an empty value by the given default value.
 * It was not intended to be used with `is.required` since there's
 * apparent reason for such. If by any means you want to use both, make
 * sure to register `is.defaultTo` before `is.required` since the
 * registration order is respected during execution.
 *
 * @param {string} [defaultValue=null]
 */
module.exports = (defaultValue = null) => {
  /**
   * @param {Object} arg
   * @param {string|null} arg.value
   * @returns {string}
   */
  return ({ value }) => {
    return isEmpty(value)
      ? defaultValue
      : value
  }
}
