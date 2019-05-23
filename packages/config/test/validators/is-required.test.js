/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const isRequired = require('../../lib/validators/is-required.js')
const { PropertyValueValidationError } = require('../../lib/errors.js')

describe('@deeptrace/config', () => {
  describe('validators', () => {
    describe('is-required', () => {
      it('returns the value when value is not empty', () => {
        const validator = isRequired()

        expect(validator({ value: 'foo' }))
          .to.be.equals('foo')
      })

      it('throws a PropertyValueValidationError error when value is empty', () => {
        const validator = isRequired()

        expect(() => validator({ value: null, requestedEnvNames: [ 'FOO_BAR' ] }))
          .to.throw(PropertyValueValidationError)
      })

      it('can throw error with a custom message', () => {
        const validator = isRequired('requires on of: {{requestedEnvNames}}')

        expect(() => validator({ value: null, requestedEnvNames: [ 'FOO', 'BAR' ] }))
          .to.throw(PropertyValueValidationError, 'requires on of: [ FOO, BAR ]')
      })
    })
  })
})
