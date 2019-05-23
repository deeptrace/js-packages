/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const asInteger = require('../../lib/casters/as-integer.js')
const { PropertyValueCastingError } = require('../../lib/errors.js')

describe('@deeptrace/config', () => {
  describe('casters', () => {
    describe('as-integer', () => {
      it('returns null when value is empty', () => {
        const caster = asInteger()

        expect(caster({ value: '', originEnvName: 'FOO' }))
          .to.be.equals(null)
      })

      it('returns the value as integer when value is a valid numeric string', () => {
        const caster = asInteger()

        expect(caster({ value: '123', originEnvName: 'FOO' }))
          .to.be.equals(123)
      })

      it('returns the value as integer when value is a valid numeric float string', () => {
        const caster = asInteger()

        expect(caster({ value: '123.123', originEnvName: 'FOO' }))
          .to.be.equals(123)
      })

      it('throws a PropertyValueCastingError when value is not a valid numeric string', () => {
        const caster = asInteger()

        expect(() => caster({ value: 'asdf', originEnvName: 'FOO' }))
          .to.throw(PropertyValueCastingError)
      })
    })
  })
})
