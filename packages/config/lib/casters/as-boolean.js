'use strict'

const { formatTemplatedText, isEmpty } = require('../utils.js')
const { PropertyValueCastingError } = require('../errors.js')

const BOOLEAN_LIKE_TRUTHY = [ '1', 'true' ]
const BOOLEAN_LIKE_FALSEY = [ '0', 'false' ]
const BOOLEAN_LIKE = BOOLEAN_LIKE_TRUTHY.concat(BOOLEAN_LIKE_FALSEY)

const ERR_MESSAGE_TEMPLATE = 'Environment variable {{originEnvName}} must be a valid boolean-like string value: [ "0", "false", "1", "true" ].'

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
  return ({ value, originEnvName }) => {
    if (isEmpty(value)) {
      return null
    }

    const lowercaseValue = value.toLowerCase()

    if (!BOOLEAN_LIKE.includes(lowercaseValue)) {
      throw new PropertyValueCastingError(formatTemplatedText(ERR_MESSAGE_TEMPLATE, {
        originEnvName
      }))
    }

    return BOOLEAN_LIKE_TRUTHY.includes(lowercaseValue)
  }
}
