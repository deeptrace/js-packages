'use strict'

const { expect } = require('chai')
const nock = require('nock')
const { URL } = require('url')

const { NativeHttpReporter, RequestTimeoutError } = require('../../../dist/index.js')
const trace = require('../../fixtures/timestaped-trace.js')

describe('@deeptrace/agent', () => {
  describe('NativeHttpReporter', () => {
    before(() => {
      nock.disableNetConnect()
    })

    after(() => {
      nock.enableNetConnect()
    })

    it('throws a RequestTimeoutError when request times out', async () => {
      const reporter = new NativeHttpReporter({
        dsn: new URL('https://foo:bar@api.deeptrace.io/'),
        headers: { foo: 'bar' },
        timeout: 1000
      })

      const request = nock('https://api.deeptrace.io:443/')
        .matchHeader('content-type', 'application/json')
        .matchHeader('authorization', 'Basic Zm9vOmJhcg==')
        .matchHeader('foo', 'bar')
        .post('/traces', JSON.stringify(trace))
        .once()
        .socketDelay(2000)
        .reply(204)

      let error = null

      await reporter
        .report(trace)
        .catch((err) => { error = err })

      expect(request.isDone()).to.be.equals(true)
      expect(error).to.not.be.equals(null)
      expect(error).to.be.an.instanceOf(RequestTimeoutError)
    })

    it('can report a trace', async () => {
      const reporter = new NativeHttpReporter({
        dsn: new URL('http://api.deeptrace.io:8442/'),
      })

      const request = nock('http://api.deeptrace.io:8442/')
        .matchHeader('content-type', 'application/json')
        .post('/traces', JSON.stringify(trace))
        .once()
        .reply(204)

      let error = null

      await reporter
        .report(trace)
        .catch((err) => { error = err })

      expect(request.isDone()).to.be.equals(true)
      expect(error).to.be.equals(null)
    })
  })
})
