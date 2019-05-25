'use strict'

const { formatTemplatedText, isEmpty } = require('../utils.js')
const { PropertyValueValidationError } = require('../errors.js')
const { URL } = require('url')

const ERR_MESSAGE_TEMPLATE = 'Environment variable {{originEnvName}} must constain a valid URL.'

/**
 * When providing a non-empty value, it tries to parse the value as an URL
 * as a way to prove it is a valid URL. Be aware that, when doing so, node's URL
 * core module ensures a trailing slash after the hostname when no path is given.
 * Providing a non-empty not valid value will result in a `PropertyValueValidationError` error.
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

    try {
      return new URL(value).toString()
    } catch (err) {
      throw new PropertyValueValidationError(formatTemplatedText(ERR_MESSAGE_TEMPLATE, {
        originEnvName
      }))
    }
  }
}
