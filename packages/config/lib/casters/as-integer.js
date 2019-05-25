'use strict'

const { isEmpty } = require('../utils.js')
const asNumber = require('./as-number.js')

/**
 * Casts a non-empty value into an `integer`.
 * If the number has a decimal case, it will be simply dropped.
 * For example, if value is "56.78" it will be casted as `integer` "56".
 * Providing a non-empty non-numeric value will result in a `PropertyValueCastingError` error.
 */
module.exports = () => {
  /**
   * @param {Object} arg
   * @param {string|null} arg.value
   * @param {string|null} arg.originEnvName
   * @returns {number|null}
   */
  return (arg) => {
    const value = asNumber()(arg)

    return isEmpty(value)
      ? null
      : ~~value
  }
}
