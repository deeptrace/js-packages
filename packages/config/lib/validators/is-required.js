'use strict'

const { formatTemplatedText, isEmpty } = require('../utils.js')
const { PropertyValueValidationError } = require('../errors.js')

const ERR_MESSAGE_TEMPLATE = 'At least one of the following environment variables must be provided: {{requestedEnvNames}}'

/**
 * Makes sure value is non-empty.
 * Providing an empty value will result in a `PropertyValueValidationError` error.
 *
 * @param {string} [errorMessageTemplate]
 */
module.exports = (errorMessageTemplate = ERR_MESSAGE_TEMPLATE) => {
  /**
   * @param {Object} arg
   * @param {string|null} arg.value
   * @param {string[]} arg.requestedEnvNames
   * @returns {string}
   * @throws {PropertyValueValidationError}
   */
  return ({ value, requestedEnvNames }) => {
    if (!isEmpty(value)) {
      return value
    }

    throw new PropertyValueValidationError(formatTemplatedText(errorMessageTemplate, {
      requestedEnvNames: `[ ${requestedEnvNames.join(', ')} ]`
    }))
  }
}
