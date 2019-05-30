'use strict'

/**
 * @param {({ environment: string, [key: string]: any }) => Object | Promise<Object>} configFactory
 * @param {({ environment: string, config: { [key: string]: any}, [key: string]: any }) => Promise<import('express').Express>} appFactory
 */
module.exports = (configFactory, appFactory) => {
  /**
   * @param {Object<string, string>} props
   * @returns {({ environment: string, [key: string]: any }) => Promise<import('express').Express>}
   */
  return async (props) => {
    return appFactory({
      ...props,
      config: await Promise.resolve(configFactory({ ...props })),
    })
  }
}
