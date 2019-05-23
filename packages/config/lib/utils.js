'use strict'

const { ConfigValidationError } = require('./errors.js')

/**
 * @param {any} value
 * @returns {boolean}
 */
const isEmpty = (value) => {
  return value === null || value === ''
}

/**
 * @param {string|string[]} value
 * @returns {string[]}
 */
const iWantAnArray = (value) => {
  return Array.isArray(value) ? value : [value]
}

/**
 * @param {string} value
 * @param {string} trailingChar
 * @returns {string}
 */
const ensureTrailing = (value, trailingChar) => {
  return value.endsWith(trailingChar) ? value : value + trailingChar
}

/**
 * @param {string} text
 * @param {Object<string, string|null} replacements
 * @returns {string}
 */
const formatTemplatedText = (text, replacements) => {
  return Object
    .keys(replacements)
    .map(key => ({
      exp: new RegExp(`{{${key}}}`, 'g'),
      value: replacements[key] || ''
    }))
    .reduce((text, { exp, value }) => text.replace(exp, value), text)
}

/**
 * @param {Function} fn
 */
const halt = (fn) => {
  return (...args) => {
    try {
      return fn(...args)
    } catch (err) {
      if (!(err instanceof ConfigValidationError)) {
        throw err
      }

      console.group(ensureTrailing(err.message, ':'))
      err.errors.forEach((e) => {
        console.log('-', ensureTrailing(e.message, '.'))
      })
      console.groupEnd()

      process.exit(1)
    }
  }
}

module.exports.isEmpty = isEmpty
module.exports.iWantAnArray = iWantAnArray
module.exports.ensureTrailing = ensureTrailing
module.exports.formatTemplatedText = formatTemplatedText
module.exports.halt = halt
