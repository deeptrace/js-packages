'use strict'

const { formatTemplatedText, isEmpty } = require('../utils.js')
const { PropertyValueCastingError } = require('../errors.js')

const ERR_MESSAGE_TEMPLATE = 'Environment variable {{originEnvName}} must constain a valid numeric string.'

/**
 * Casts a non-empty value into a `number`.
 * If the number has a decimal case, it will be kept.
 * Providing a non-empty non-numeric value will result in a `PropertyValueCastingError` error.
 */
module.exports = () => {
  /**
   * @param {Object} arg
   * @param {string|null} arg.value
   * @param {string|null} arg.originEnvName
   * @returns {number|null}
   */
  return ({ value, originEnvName }) => {
    if (isEmpty(value)) {
      return null
    }

    const numberValue = Number(value)

    if (isNaN(numberValue)) {
      throw new PropertyValueCastingError(formatTemplatedText(ERR_MESSAGE_TEMPLATE, {
        originEnvName
      }))
    }

    return numberValue
  }
}
