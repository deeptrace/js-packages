'use strict'

const env = require('sugar-env')
const { iWantAnArray } = require('./utils.js')
const { ConfigValidationError, PropertyValueBuildingError } = require('./errors.js')

const casters = {
  boolean: require('./casters/as-boolean.js'),
  integer: require('./casters/as-integer.js'),
  number: require('./casters/as-number.js')
}

const validators = {
  defaultTo: require('./validators/is-default-to.js'),
  required: require('./validators/is-required.js'),
  url: require('./validators/is-url.js')
}

/**
 * @callback GetFnSignature
 * @argument {string|string[]} lookupNames
 * @argument {Function[]} middlewares
 * @returns {any|null}
 */

/**
 * @callback FactoryFnSignature
 * @argument {{ env: GetFnSignature, is: typeof validators, as: typeof casters }} arg
 * @returns {any|null}
 */

/**
 * @param {FactoryFnSignature} fn
 * @returns {object}
 */
module.exports = (fn) => {
  const errors = []

  /**
   * @type {GetFnSignature}
   */
  const get = (lookupNames, middlewares = []) => {
    const requestedEnvNames = iWantAnArray(lookupNames)

    let originalValue = null
    let originEnvName = null

    for (originEnvName of requestedEnvNames) {
      originalValue = env.get(originEnvName)
      if (originalValue) break
    }

    try {
      return middlewares.reduce(
        (value, middleware) => middleware({ value, originalValue, originEnvName, requestedEnvNames }),
        originalValue
      )
    } catch (err) {
      if (!(err instanceof PropertyValueBuildingError)) {
        throw err
      }

      errors.push(err)
    }

    return null
  }

  const value = fn({ env: get, is: validators, as: casters })

  if (errors.length > 0) {
    throw new ConfigValidationError(errors)
  }

  return value
}
