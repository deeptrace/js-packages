'use strict'

const { isEmpty } = require('../utils.js')

/**
 * @param {string} [defaultValue]
 */
module.exports = (defaultValue) => {
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
