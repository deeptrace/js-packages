/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const utils = require('../lib/utils.js')

describe('@deeptrace/config', () => {
  describe('utils', () => {
    describe('.isEmpty', () => {
      it('returns true when value is null', () => {
        expect(utils.isEmpty(null))
          .to.be.equals(true)
      })

      it('returns true when value is an empty string', () => {
        expect(utils.isEmpty(''))
          .to.be.equals(true)
      })

      it('returns false when value is a non-empty string', () => {
        expect(utils.isEmpty('bla'))
          .to.be.equals(false)
      })
    })

    describe('.iWantAnArray', () => {
      it('returns an array when value is not an array', () => {
        expect(utils.iWantAnArray('foo'))

          .to.be.deep.equals(['foo'])
      })

      it('returns an array when value is an array', () => {
        expect(utils.iWantAnArray(['foo']))
          .to.be.deep.equals(['foo'])
      })
    })

    describe('.ensureTrailing', () => {
      it('does nothing when the value ends with the trailingChar', () => {
        expect(utils.ensureTrailing('foo:', ':'))
          .to.be.equals('foo:')
      })

      it('adds the trailingChar to the end of the value when value does not ends with trailingChar', () => {
        expect(utils.ensureTrailing('foo', ':'))
          .to.be.equals('foo:')
      })
    })

    describe('.formatTemplatedText', () => {
      it('replaces template variables {{like_this_one}} by their values from replacements object', () => {
        const text = 'foobar {{foo}}{{bar}} {{foobar}}'
        const replacements = {
          foo: 'foo',
          bar: 'bar',
          foobar: 'foobaz'
        }

        expect(utils.formatTemplatedText(text, replacements))
          .to.be.equals('foobar foobar foobaz')
      })

      it('when the text has an unknown template variable, it does not get replaced', () => {
        const text = 'foobar {{foo}}{{bar}} {{wtf}}'
        const replacements = {
          foo: 'foo',
          bar: 'bar'
        }

        expect(utils.formatTemplatedText(text, replacements))
          .to.be.equals('foobar foobar {{wtf}}')
      })
    })
  })
})
