/* eslint-env mocha */
'use strict'

const axiosist = require('axiosist')
const appify = require('../lib/appify-factory.js')
const env = require('sugar-env')
const { expect } = require('chai')
const { UnprocessableEntityHttpError } = require('@deeptrace/commons')

describe('appify', () => {
  let factoryarg
  let api

  before(async () => {
    const factory = appify(async ({ router, config, environment, logger }) => {
      factoryarg = { router, config, environment, logger }

      router.get('/foo', (_req, res) => {
        res.end('bar')
      })

      router.get('/err', (_req, _res, next) => {
        next(new Error('non-http error message'))
      })

      router.get('/422', (_req, _res, next) => {
        next(new UnprocessableEntityHttpError({
          code: 'ARBITRARY_CODE',
          message: 'fluvers invalid payload',
          details: [
            { foo: 'bar' }
          ]
        }))
      })
    })

    api = axiosist(await factory({
      environment: env.TEST,
      logger: {
        log: () => {},
        error: () => {}
      }
    }))
  })

  it('passes a `router` property into the factory function, which is an instance of express.Router', () => {
    expect(factoryarg).to.have.a.property('router')
  })

  it('passes a `config` object property into the factory function', () => {
    expect(factoryarg).to.have.a.property('config')
    expect(factoryarg.config).to.be.an('object')
  })

  it('passes an `environment` string property into the factory function', () => {
    expect(factoryarg).to.have.a.property('environment')
    expect(factoryarg.environment).to.be.a('string')
  })

  it('passes a `logger` object property into the factory function', () => {
    expect(factoryarg).to.have.a.property('logger')
    expect(factoryarg.logger).to.be.an('object')
    expect(factoryarg.logger).to.have.a.property('log')
    expect(factoryarg.logger.log).to.be.a('function')
    expect(factoryarg.logger).to.have.a.property('error')
    expect(factoryarg.logger.error).to.be.a('function')
  })

  it('successfully exposes a ping endpoint', async () => {
    const response = await api
      .get('/ping')
      .catch((err) => err.response)

    expect(response.status).to.be.equal(200)
    expect(response.data).to.be.equals('pong!')
  })

  it('allows exposing custom endpoints using router', async () => {
    const response = await api
      .get('/foo')
      .catch((err) => err.response)

    expect(response.status).to.be.equal(200)
    expect(response.data).to.be.equals('bar')
  })

  it('non-http errors gets exposed as internal server error', async () => {
    const response = await api
      .get('/err')
      .catch((err) => err.response)

    expect(response.status).to.be.equal(500)
    expect(response.data.error.message).to.be.equals('non-http error message')
  })

  it('http errors gets properly rendered and details are exposed', async () => {
    const response = await api
      .get('/422')
      .catch((err) => err.response)

    expect(response.status).to.be.equal(422)
    expect(response.data.error.code).to.be.equals('ARBITRARY_CODE')
    expect(response.data.error.message).to.be.equals('fluvers invalid payload')
    expect(response.data.error.details).to.have.length(1)
  })

  it('requesting an unregistered route results in a 404 error', async () => {
    const response = await api
      .get('/bla')
      .catch((err) => err.response)

    expect(response.status).to.be.equal(404)
  })
})
