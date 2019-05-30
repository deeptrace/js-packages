/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const sinon = require('sinon')
const withConfigFactory = require('../lib/with-config-factory.js')

describe('withConfigFactory', () => {
  const environment = 'dev'
  const config = { foo: 'bar' }

  const sandbox = sinon.createSandbox()
  const appFactory = sandbox.mock()
  const configFactory = sandbox.mock().resolves(config)

  afterEach(() => {
    sandbox.resetHistory()
  })

  it('resolves the configFactory passing the same arguments it received', async () => {
    await withConfigFactory(configFactory, appFactory)({ environment, foo: 'bar' })

    expect(configFactory.calledOnceWith({ environment, foo: 'bar' }))
      .to.be.equals(true)
  })

  it('passes the config result to appFactory', async () => {
    await withConfigFactory(configFactory, appFactory)({ environment })

    expect(appFactory.calledOnceWith({ environment, config: { foo: 'bar' } }))
      .to.be.equals(true)
  })

  it('also passes environment and any other property received to appFactory', async () => {
    await withConfigFactory(configFactory, appFactory)({ environment, bar: 'baz' })

    expect(appFactory.calledOnceWith({ environment, config: { foo: 'bar' }, bar: 'baz' }))
      .to.be.equals(true)
  })
})
