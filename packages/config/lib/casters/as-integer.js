'use strict'

const { isEmpty } = require('../utils.js')
const { PropertyValueCastingError } = require('../errors.js')
const asNumber = require('./as-number.js')

/**
 * Just to keep the same signature for all middlewares.
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
